document.addEventListener('DOMContentLoaded', () => {
         const searchBar = document.getElementById('search-bar');
    const searchButton = document.getElementById('search-button');
    const menuListSections = document.querySelectorAll('section#menu-list');

    const filterFoodItems = () => {
        const searchTerm = searchBar.value.toLowerCase();

        menuListSections.forEach(section => {
            const foodItems = section.querySelectorAll('.food-item');
            let anyFoodItemVisibleInThisSection = false; 

            foodItems.forEach(item => {
                const foodNameElement = item.querySelector('.food-heading');
                const foodDescriptionElement = item.querySelector('.food-description');

                const foodName = foodNameElement ? foodNameElement.textContent.toLowerCase() : '';
                const foodDescription = foodDescriptionElement ? foodDescriptionElement.textContent.toLowerCase() : '';

                if (foodName.includes(searchTerm) || foodDescription.includes(searchTerm)) {
                    item.style.display = 'block'; 
                    anyFoodItemVisibleInThisSection = true;
                } else {
                    item.style.display = 'none'; 
                }
            });

            const cuisineHeadingDiv = section.previousElementSibling;

            if (cuisineHeadingDiv && cuisineHeadingDiv.classList.contains('cuisine')) {
                if (anyFoodItemVisibleInThisSection) {
                    cuisineHeadingDiv.style.display = 'flex'; 
                } else {
                    cuisineHeadingDiv.style.display = 'none'; 
                }
            }
        });
    };

    searchButton.addEventListener('click', filterFoodItems);
    searchBar.addEventListener('input', filterFoodItems); 
    searchBar.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') { 
            filterFoodItems();
        }
    });

    const orderButtons = document.querySelectorAll('.order-button');
    const orderList = document.getElementById('order-list');
    const totalPriceSpan = document.getElementById('total-price');
    const emptyCartMessage = document.getElementById('empty-cart-message');

    let order = [];

    function updateOrderDisplay() {
        orderList.innerHTML = ''; 
        let total = 0;

        if (order.length === 0) {
            emptyCartMessage.style.display = 'block'; 
        } else {
            emptyCartMessage.style.display = 'none';
            order.forEach(item => {
                const orderItemDiv = document.createElement('div');
                orderItemDiv.classList.add('order-item');
                orderItemDiv.setAttribute('data-name', item.name); 

                const itemDetails = document.createElement('div');
                itemDetails.classList.add('item-details');
                itemDetails.innerHTML = `
                    <span>${item.name}</span>
                    (Qty: <span class="quantity">${item.quantity}</span>)
                    - ₹<span class="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                `;

                const itemControls = document.createElement('div');
                itemControls.classList.add('item-controls');
                itemControls.innerHTML = `
                    <button class="plus-btn">+</button>
                    <button class="minus-btn">-</button>
                    <button class="delete-btn">Delete</button>
                `;

                orderItemDiv.appendChild(itemDetails);
                orderItemDiv.appendChild(itemControls);
                orderList.appendChild(orderItemDiv);

                total += item.price * item.quantity;
            });
        }
        totalPriceSpan.textContent = total.toFixed(2);
    }

    orderButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const foodItemDiv = event.target.closest('.food-item');
            if (foodItemDiv) {
                const itemName = foodItemDiv.querySelector('.food-heading').textContent.trim();
                const itemPriceText = foodItemDiv.querySelector('.food-price').textContent.trim();
                const itemPrice = parseFloat(itemPriceText.replace('₹', ''));

                const existingItem = order.find(item => item.name === itemName);

                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    order.push({ name: itemName, price: itemPrice, quantity: 1 });
                }
                updateOrderDisplay();
            }
        });
    });

    orderList.addEventListener('click', (event) => {
        const target = event.target;
        const orderItemDiv = target.closest('.order-item');

        if (orderItemDiv) {
            const itemName = orderItemDiv.dataset.name;
            const itemIndex = order.findIndex(item => item.name === itemName);

            if (itemIndex > -1) {
                if (target.classList.contains('plus-btn')) {
                    order[itemIndex].quantity++;
                } else if (target.classList.contains('minus-btn')) {
                    if (order[itemIndex].quantity > 1) {
                        order[itemIndex].quantity--;
                    }
                } else if (target.classList.contains('delete-btn')) {
                    order.splice(itemIndex, 1);
                }
                updateOrderDisplay();
            }
        }
    });

    updateOrderDisplay();

    const deliveryPaymentForm = document.getElementById('delivery-payment-form');
    const paymentConfirmation = document.getElementById('payment-confirmation');
    const confirmedAddress = document.getElementById('confirmed-address');
    const confirmedPaymentMethod = document.getElementById('confirmed-payment-method');
    const confirmedTotalPrice = document.getElementById('confirmed-total-price');

    deliveryPaymentForm.addEventListener('submit', (event) => {
        event.preventDefault(); 

        if (order.length === 0) {
            alert('Your cart is empty. Please add items before proceeding to payment.');
            return;
        }

        const customerName = document.getElementById('customer-name').value.trim();
        const deliveryAddress = document.getElementById('delivery-address').value.trim();
        const paymentMethod = document.getElementById('payment-method').value;
        const currentTotal = totalPriceSpan.textContent; 
        if (!customerName || !deliveryAddress || !paymentMethod) {
            alert('Please fill in all delivery and payment details.');
            return;
        }

        confirmedAddress.textContent = deliveryAddress;
        confirmedPaymentMethod.textContent = paymentMethod === 'cod' ? 'Cash on Delivery' :
                                             (paymentMethod === 'card' ? 'Credit/Debit Card' : 'UPI');
        confirmedTotalPrice.textContent = currentTotal;

        deliveryPaymentForm.style.display = 'none'; 
        paymentConfirmation.style.display = 'block'; 

        order = []; 
        updateOrderDisplay(); 
    });
}); 
