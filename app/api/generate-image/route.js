const platformDocumentMap = {
    instagram: 'd6a82abe0953e76ffcfea8cfa9c40c2e',
    linkedin: '1b39be428cba28d5b14e939811a4135f',
    facebook: '74f6d49e561388c834dbd1ec21a8752b',
};

// Helper to upload to imgbb if base64 is rejected (optional fallback)
async function uploadToImgBB(base64Data) {
    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey || !base64Data || base64Data === 'default') return base64Data;

    try {
        // Remove data:image/...;base64, prefix
        const base64Content = base64Data.split(',')[1] || base64Data;
        const formData = new URLSearchParams();
        formData.append('image', base64Content);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        return data?.data?.url || base64Data;
    } catch (err) {
        console.error('ImgBB upload error:', err);
        return base64Data;
    }
}

export async function POST(request) {
    try {
        const {
            mainTitle,
            captionText,
            mainImageBase64,
            mainImageUrl: passedMainImageUrl,
            brandLogoBase64,
            platform = 'instagram',
        } = await request.json();

        // Aggressively sanitize input text and API Key to remove any hidden control characters (0x00-0x1F)
        const sanitize = (str) => typeof str === 'string' ? str.replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim() : str;

        const cleanTitle = sanitize(mainTitle);
        const cleanCaption = sanitize(captionText);
        const apiKey = sanitize(process.env.PIXELIXE_API_KEY);

        if (!cleanTitle || !cleanCaption) {
            return Response.json(
                { error: 'Post title and caption text are required.' },
                { status: 400 }
            );
        }

        if (!apiKey) {
            return Response.json(
                { error: 'Pixelixe API key is not configured.' },
                { status: 500 }
            );
        }

        const documentUid = platformDocumentMap[platform] || platformDocumentMap.instagram;

        // Optional: Upload to ImgBB if needed, or use passed URL directly 
        const mainImageUrl = passedMainImageUrl || await uploadToImgBB(mainImageBase64 || 'default');
        const brandLogoUrl = await uploadToImgBB(brandLogoBase64 || 'default');

        const modifications = [
            {
                name: 'main_title',
                type: 'text',
                text: cleanTitle,
                color: 'rgb(255, 255, 255)',
                'font-size': 'auto',
                visible: 'true',
            },
            {
                name: 'caption_text',
                type: 'text',
                text: cleanCaption,
                color: 'rgb(255, 255, 255)',
                'font-size': 'auto',
                visible: 'true',
            },
            {
                name: 'main_image',
                type: 'image',
                image_url: mainImageUrl,
                width: 'auto',
                height: 'auto',
                visible: 'true',
            },
            {
                name: 'brand_logo',
                type: 'image',
                image_url: brandLogoUrl,
                width: 'auto',
                height: 'auto',
                visible: 'true',
            },
        ];

        // api_key goes in the JSON body — NOT as a header
        const pixelixePayload = {
            document_uid: documentUid,
            api_key: apiKey,
            image_type: 'jpeg',
            format: 'json',
            modifications,
        };

        const response = await fetch(
            'https://studio.pixelixe.com/api/graphic/automation/v1',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pixelixePayload),
            }
        );

        const responseText = await response.text();
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse Pixelixe JSON response:', responseText);
            return Response.json(
                { error: `Pixelixe returned an invalid response (not JSON). Status: ${response.status}`, raw: responseText },
                { status: 500 }
            );
        }

        if (!response.ok) {
            const errorMessage =
                data?.message || data?.error || 'Failed to generate image via Pixelixe.';
            return Response.json({ error: errorMessage }, { status: response.status });
        }

        // Pixelixe returns the graphic URL in various fields
        const imageUrl =
            data?.image_url ||
            data?.graphic_url ||
            data?.public_jpeg_url ||
            data?.graphicUrl ||
            data?.url ||
            data?.data?.url ||
            data?.image ||
            null;

        if (!imageUrl) {
            console.error('Unexpected Pixelixe response:', JSON.stringify(data));
            return Response.json(
                { error: 'Image generated but URL not found in API response.', raw: data },
                { status: 200 }
            );
        }

        return Response.json({ imageUrl });
    } catch (err) {
        console.error('Generate image error:', err);
        return Response.json(
            { error: err.message || 'An unexpected error occurred.' },
            { status: 500 }
        );
    }
}


