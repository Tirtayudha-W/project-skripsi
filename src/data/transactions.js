const rawTransactions = [
  { userId: 1, itemName: "Brownies", itemType: "cokelat", image: "/images/brownies.jpg", price: 16000 },
  { userId: 1, itemName: "Tart Cokelat", itemType: "cokelat", image: "/images/tart.jpg", price: 25000 },
  { userId: 2, itemName: "Donat Cokelat", itemType: "cokelat", image: "/images/donat.jpg", price: 10000 },
  { userId: 2, itemName: "Brownies", itemType: "cokelat", image: "/images/brownies.jpg", price: 16000 },
  { userId: 3, itemName: "Cheesecake", itemType: "keju", image: "/images/cheesecake.jpg", price: 20000 },
  { userId: 3, itemName: "Donat Keju", itemType: "keju", image: "/images/donatkeju.jpg", price: 10000 },
  { userId: 3, itemName: "Sagu Keju", itemType: "keju", image: "/images/sagu.jpg", price: 18000 },
  { userId: 4, itemName: "Donat Cokelat", itemType: "cokelat", image: "/images/donat.jpg", price: 10000 },
  { userId: 4, itemName: "Donat Keju", itemType: "keju", image: "/images/donatkeju.jpg", price: 10000 },
];

// Filter agar itemName unik
const seen = new Set();
const transactions = rawTransactions.filter((item) => {
  if (seen.has(item.itemName)) {
    return false;
  }
  seen.add(item.itemName);
  return true;
});

export default transactions;