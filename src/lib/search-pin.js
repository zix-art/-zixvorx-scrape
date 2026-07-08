async function searchpinterest(keyword) {
    const encodedQuery = encodeURIComponent(keyword);
    const apiUrl = `https://api.siputzx.my.id/api/s/pinterest?query=${encodedQuery}&type=image`;
    
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.status && Array.isArray(result.data)) {
            
            const extractedData = result.data.map(item => {
                return {
                    id: item.id,
                    title: item.grid_title || "Tanpa Judul",
                    description: item.description?.trim() || "",
                    image_url: item.image_url,
                    pin_url: item.pin,
                    author: item.pinner?.username || "unknown",
                    reactions: item.reaction_counts?.["1"] || 0 // Biasanya "1" adalah kode untuk Like/Love
                };
            });
            
            return {
                success: true,
                keyword: keyword,
                total_results: extractedData.length,
                data: extractedData
            };
        } else {
            return { 
                success: false, 
                error: "Tidak ada hasil yang ditemukan atau API sedang bermasalah." 
            };
        }
    } catch (error) {
        return { 
            success: false, 
            error: error.message 
        };
    }
}

modile.exports = searchpinterest;