export const formatSalary = (salary) => {
    if (!salary) {
      return "Thỏa thuận";
    }
    return salary.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};