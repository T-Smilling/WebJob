export const rules = {
    required: {
        required: true,
        message: "Thông tin này không được để trống!",
    },
    phone: {
        pattern: /^[0-9]{10}$/,
        message: "Số điện thoại phải gồm 10 chữ số!",
    },
    password: {
        pattern: /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
        message: "Mật khẩu có thể chứa chữ cái, số hoặc ký tự đặc biệt!",
    },
};

