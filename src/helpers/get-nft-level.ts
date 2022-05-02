export const getNFTLevel = (amount: number) => {
    if (amount >= 30000) return 6;
    else if (amount >= 20000) return 5;
    else if (amount >= 15000) return 4;
    else if (amount >= 10000) return 3;
    else if (amount >= 5000) return 2;
    else if (amount >= 2000) return 1;
    else return 0;
};
