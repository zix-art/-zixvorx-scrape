async function ttdl(tiktokUrl) {
    const encodedUrl = encodeURIComponent(tiktokUrl);
    const apiUrl = `https://api.siputzx.my.id/api/d/tiktok?url=${encodedUrl}`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const result = await response.json();
        
        if (result.status && result.data && result.data.media) {
            const data = result.data;
            
            // Mencari video HD, jika tidak ada fallback ke SD
            const videoObj = data.media.find(item => item.quality === 'HD') || 
                             data.media.find(item => item.quality === 'SD');
            
            return {
                success: true,
                platform: "TikTok",
                author: data.author,
                title: data.title !== "No description" ? data.title : "",
                thumbnail: data.thumbnail,
                quality: videoObj ? videoObj.quality : "Unknown",
                video_url: videoObj ? (videoObj.backup || videoObj.url) : null
            };
        } else {
            return { success: false, error: "Gagal memparsing data dari API TikTok." };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

module.exports = ttdl;