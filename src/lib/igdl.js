async function igdl(igUrl) {
    const encodedUrl = encodeURIComponent(igUrl);
    const apiUrl = `https://api.siputzx.my.id/api/d/igram?url=${encodedUrl}`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        if (data.status && data.data) {
            const meta = data.data.meta || {};
            const downloadUrls = data.data.url || [];
            
            return {
                success: true,
                platform: "Instagram",
                username: meta.username,
                caption: meta.title,
                likes: meta.like_count,
                comments: meta.comment_count,
                thumbnail: data.data.thumb,
                // Mengambil link video pertama yang tersedia
                video_url: downloadUrls.length > 0 ? downloadUrls[0].url : null
            };
        } else {
            return { success: false, error: "Gagal memparsing data dari API Instagram." };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

module.exports = igdl;