import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

const { rules } = pluginReact; // Lấy thuộc tính rules từ pluginReact

export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "no-console": "warn",       // Cảnh báo nếu dùng console.log
      "eqeqeq": "error",          // Bắt buộc sử dụng === thay vì ==
      "react/prop-types": "off",  // Tắt kiểm tra prop-types trong React
      "react-hooks/rules-of-hooks": "error",  // Báo lỗi nếu các quy tắc của Hooks không được tuân thủ
      "react-hooks/exhaustive-deps": "warn",  // Cảnh báo nếu các phụ thuộc trong mảng phụ thuộc của Hook useEffect không được liệt kê đầy đủ
      "react/display-name": "off",  // Tắt cảnh báo nếu một component React không có displayName
      "no-lonely-if": "warn", // Cảnh báo nếu có câu lệnh if đứng một mình không cần thiết
      "no-unused-vars": "warn", // Cảnh báo khi có biến được khai báo nhưng không được sử dụng
      "no-trailing-spaces": "warn", // Cảnh báo khi có khoảng trắng thừa ở cuối dòng
      "no-multi-spaces": "warn",  // Cảnh báo khi có nhiều khoảng trắng liên tiếp trong mã
      "no-multiple-empty-lines": "warn",  // Cảnh báo nếu có nhiều dòng trống liên tiếp
      "space-before-blocks": ["error", "always"], // Báo lỗi nếu không có khoảng trắng trước các khối mã như trong if, for, function, v.v.
      "object-curly-spacing": ["warn", "always"], // Cảnh báo nếu không có khoảng trắng bên trong dấu ngoặc nhọn {} của đối tượng
      "indent": ["warn", "error"],  // Cảnh báo hoặc báo lỗi nếu không thụt lề đúng cách
      "semi": ["warn", "never"],  // Cảnh báo nếu có dấu chấm phẩy ở cuối câu lệnh
      "quotes": ["error", "single"],  // Báo lỗi nếu không sử dụng dấu nháy đơn thay vì dấu nháy kép
      "array-bracket-spacing": "warn",  // Cảnh báo nếu không có khoảng trắng bên trong dấu ngoặc vuông [] của mảng
      "linebreak-style": "off", // Tắt kiểm tra kiểu ngắt dòng
      "no-unexpected-multiline": "warn",  // Cảnh báo nếu có các biểu thức đa dòng mà có thể gây ra lỗi không mong muốn
      "keyword-spacing": "warn",  // Cảnh báo nếu không có khoảng trắng đúng cách trước và sau từ khóa như if, for, function, v.v.
      "comma-dangle": "warn", // Cảnh báo nếu có dấu phẩy thừa ở cuối danh sách
      "comma-spacing": "warn",  // Cảnh báo nếu không có khoảng trắng đúng cách sau dấu phẩy
      "arrow-spacing": "warn" // Cảnh báo nếu không có khoảng trắng đúng cách trước và sau dấu mũi tên trong các hàm mũi tên (=>)
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];