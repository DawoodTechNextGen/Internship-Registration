const validateWhatsAppNumber = (number) => {
    const regex = /^\+92\d{10}$/;
    return regex.test(number);
};

export { validateWhatsAppNumber };