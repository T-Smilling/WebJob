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
        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
        message: "Mật khẩu phải có ít nhất 6 ký tự, gồm chữ và số!",
    },
};

