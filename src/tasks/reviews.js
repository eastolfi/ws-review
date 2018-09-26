const https = require("https");

const fetchReview = () => {
    return new Promise((resolve, reject) => {
        https.get("https://www.wanikani.com/api/user/9922522cc9ab8c79c010debe6f316656/study-queue", (resp) => {
            let data = "";
        
            resp.on("data", chunk => {
                data += chunk
            });
        
            resp.on("end", () => {
                resolve(JSON.parse(data));
            });
        }).on("error", error => {
            reject(error);
        });
    });
};

const unixTimestampToDate = (ts) => {
    if (!ts || isNaN(ts)) {
        return null;
    } else {
        return new Date(ts * 1000);
    }
};

class ReviewTask {
    static run() {
        return new Promise((resolve, reject) => {
            fetchReview()
            .then(result => {
                let reviewInfo = result.requested_information;
                let message = "";
                
                if (reviewInfo.reviews_available > 0) {
                    message = `You have ${reviewInfo.reviews_available} items to review`;
                } else {
                    message = `The next review will be the ${unixTimestampToDate(reviewInfo.next_review_date)}`;
                }
                
                resolve(message);
            })
            .catch(error => {
                reject(error);
            });
        });
    }
}

module.exports = ReviewTask;