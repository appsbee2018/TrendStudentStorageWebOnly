import * as XLSX from 'xlsx';
import React from 'react';

const exportToExcel = (excelData, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}


export default exportToExcel;