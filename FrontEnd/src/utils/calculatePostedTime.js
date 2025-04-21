export const calculatePostedTime = (createAt) => {
    const now = new Date();
    const postedDate = new Date(createAt);
    const diffInMs = now - postedDate; // Khoảng cách thời gian tính bằng milliseconds

    const diffInHours = diffInMs / (1000 * 60 * 60); // Chuyển sang giờ
    const diffInDays = diffInHours / 24; // Chuyển sang ngày
    const diffInMonths = diffInDays / 30; // Chuyển sang tháng (gần đúng)
    const diffInYears = diffInDays / 365; // Chuyển sang năm

    if (diffInHours < 24) {
        return "Hôm nay";
    } else if (diffInDays < 30) {
        return `${Math.floor(diffInDays)} ngày trước`;
    } else if (diffInDays < 365) {
        return `${Math.floor(diffInMonths)} tháng trước`;
    } else {
        return `${Math.floor(diffInYears)} năm trước`;
    }
};