import { toast } from 'react-toastify';

class FormValidation {
    static validateFormData(formData) {
        for (let key in formData) {
            if (formData[key].trim() === '') {
                toast.error(`Vui lòng điền đầy đủ thông tin cho ${key}.`);
                return false;
            }
        }
        // if (!/^[a-zA-Z0-9]*$/.test(formData.taiKhoan)) {
        //     toast.error('Tài khoản không được chứa ký tự đặc biệt.');
        //     return false;
        // }
        // if (!/^[a-zA-Z0-9\s]*$/.test(formData.taiKhoan)) {
        //     toast.error('Tài khoản không được chứa ký tự đặc biệt.');
        //     return false;
        // }
        
        if (/\s/.test(formData.matKhau)) {
            toast.error('Mật khẩu không được chứa khoảng trắng.');
            return false;
        }

        if (formData.matKhau.length < 6 || !/[A-Z]/.test(formData.matKhau)) {
            toast.error('Mật khẩu phải chứa ít nhất 6 kí tự và có ít nhất 1 kí tự viết hoa.');
            return false;
        }

        if (formData.matKhau !== formData.xacNhanMatKhau) {
            toast.error('Mật khẩu và xác nhận mật khẩu không khớp.');
            return false;
        }

        if (!/^\d{8,11}$/.test(formData.soDienThoai)) {
            toast.error('Số điện thoại phải có từ 8 đến 11 số.');
            return false;
        }

        return true;
    }
}

export default FormValidation;
