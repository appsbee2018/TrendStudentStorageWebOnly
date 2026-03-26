const dateFormat = (date) => {
    if (date) {
        const dateNoTime = date?.split('T')[0];
    
        const [year, month, day] = dateNoTime?.split("-");
        const dateObject = new Date(year, month - 1, day); 

        return `${(dateObject.getMonth() + 1)}/${dateObject.getDate()}/${dateObject.getFullYear()}`
    } else {
        return "Date Error"
    }
}

export default dateFormat;