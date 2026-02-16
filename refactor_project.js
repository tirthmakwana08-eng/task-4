// simulation of 10,000 products and 5,000 categories
const products = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Product_${i}`,
    categoryId: i % 50,
    price: Math.random() * 100
}));

const categories = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    discount: 0.1 // 10% discount
}));

function getInventoryReport(products, categories) {
    console.time("Process Time (Messy)");
    let finalReport = [];

    // PROBLEM 1: O(N * M) Complexity. For every product, we scan the whole category list.
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        let appliedDiscount = 0;

        for (let j = 0; j < categories.length; j++) {
            if (categories[j].id === product.categoryId) {
                appliedDiscount = categories[j].discount;
            }
        }

        // PROBLEM 2: Manual Object Cloning (Slow in loops)
        const discountedPrice = product.price * (1 - appliedDiscount);
        
        // PROBLEM 3: Inefficient String Concatenation in a loop
        let status = "";
        if (discountedPrice > 50) { status = "Premium"; } 
        else { status = "Standard"; }

        finalReport.push({
            ...product,
            discountedPrice: discountedPrice.toFixed(2),
            tier: status
        });
    }

    console.timeEnd("Process Time (Messy)");
    return finalReport;
}

getInventoryReport(products, categories);

/**
 * REFACTORED VERSION: Optimized for O(N) complexity
 */
function getInventoryReportOptimized(products, categories) {
    console.time("Process Time (Optimized)");

    // STEP 1: Pre-index categories into a Map (O(M) time)
    // This allows O(1) lookup later instead of nested loops.
    const categoryMap = new Map(categories.map(c => [c.id, c.discount]));

    // STEP 2: Use .map() for cleaner, immutable transformations
    const report = products.map(product => {
        const discount = categoryMap.get(product.categoryId) || 0;
        const discountedPrice = product.price * (1 - discount);

        // STEP 3: Decouple logic (Business rules separated)
        return {
            id: product.id,
            name: product.name,
            discountedPrice: Number(discountedPrice.toFixed(2)),
            tier: discountedPrice > 50 ? "Premium" : "Standard"
        };
    });

    console.timeEnd("Process Time (Optimized)");
    return report;
}

getInventoryReportOptimized(products, categories);