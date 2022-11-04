import { select, classNames, templates } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Product {
  constructor(id, data) {
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;
    //od razu po utworzeniu instancji zostanie uruchomiona w pierwszej kolejności poniższa funkcja
    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
  }

  /*tworzenie produktów na stronie, jej zadania:
      -generowanie htmla pojedynczego prod
      -tworzy elem dom na podst powyższego kodu
      -znajduje kontener menu
      -wstawia dom do kontenera */
  renderInMenu() {
    const thisProduct = this;

    /*generate HTML based on template- wyge kodu na pods szabl 
            - menuProducts- nazwa szablonu z templates*/
    const generatedHTML = templates.menuProduct(thisProduct.data);

    /*create element using utils.createElementFromHTML- utworzenie elementu za pomocą utils.createElementFromHTML*/
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);

    /*find menu container- znalezienie kontenera dla menu*/
    const menuContainer = document.querySelector(select.containerOf.menu);

    /*add element to menu- dodanie elementu do menu*/
    menuContainer.appendChild(thisProduct.element);
  }

  getElements() {
    const thisProduct = this;
    thisProduct.dom = {};

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);

    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);

    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);

    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);

    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);

    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);

    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }

  initAccordion() {
    const thisProduct = this;

    /* find the clickable trigger (the element that should react to clicking) */
    //znalezienie elementu, który ma reagować na kliknięcie- header
    // const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);

    /* START: add event listener to clickable trigger on event click -dodaj zdarzenie po kliknięciu w wyzwalacz- header */
    thisProduct.accordionTrigger.addEventListener('click', function (event) {

      /* prevent default action for event */
      event.preventDefault();

      /* find active product (product that has active class). Odnajdź elementy, które posaidają klasę active- patrz szablon */
      const activeProduct = document.querySelector(select.all.menuProductsActive);

      /* if there is active product and it's not thisProduct.element, remove class active from it. Jak czytać tą poniższą linijkę kodu??? */
      if (activeProduct != thisProduct.element && activeProduct != null) {
        activeProduct.classList.remove('active');
      }

      /* toggle active class on thisProduct.element */
      thisProduct.element.classList.toggle('active');
    });
  }

  initOrderForm() {
    const thisProduct = this;

    thisProduct.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
    });

    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function () {
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }

  processOrder() {
    const thisProduct = this;

    // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']} Konwertuje dane i zwraca jako obiekty z danymi
    const formData = utils.serializeFormToObject(thisProduct.form);

    // set price to default price- tutaj będzie cena produktu
    let price = thisProduct.data.price;

    // for every category (param)...
    for (let paramId in thisProduct.data.params) {
      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      const param = thisProduct.data.params[paramId];

      // for every option in this category
      for (let optionId in param.options) {
        // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
        //option- ma dostać się do całego obiektu dostępnego pod określoną właściwością
        const option = param.options[optionId];

        // NEW czy w formData istnieje właściwość o nazwie zgodnej z nazwą kategorii
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
        if (optionSelected) {
          if (!option.default) {
            price += option.price;
          }
        } else if (option.default) {
          price -= option.price;
        }

        //NEW find image class=paramId-optionId
        const optionImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
        if (optionImage) {
          if (optionSelected) {
            optionImage.classList.add(classNames.menuProduct.imageVisible);
          } else {
            optionImage.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
      }
    }
    //multiply price by amount
    price *= thisProduct.amountWidget.value;

    //add new property "priceSingle" to thisProduct

    thisProduct.priceSingle = price;

    // update calculated price in the HTML
    thisProduct.priceElem.innerHTML = price;
    thisProduct.price = price;
  }

  initAmountWidget() {
    //ma tworzyć nową instancję klasy AmoundWidget i zapisywać ją do właściwości produktu
    const thisProduct = this;
    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function () {
      thisProduct.processOrder();
    });
  }

  addToCart() {
    const thisProduct = this;
    // app.cart.add(thisProduct.prepareCartProduct());

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct.prepareCartProduct(),
      },
    });

    thisProduct.element.dispatchEvent(event);
  }

  prepareCartProduct() {
    const thisProduct = this;

    const productSummary = {
      //M- skąd wziąć te informacje???
      id: thisProduct.id,
      name: thisProduct.data.name,

      //z metody processOrder
      amount: thisProduct.amountWidget.value,
      priceSingle: thisProduct.priceSingle,

      price: thisProduct.price,
      params: thisProduct.prepareCartProductParams(),
    };
    return productSummary;
  }

  prepareCartProductParams() {
    // zadaniem powinno być przejście po wszystkich kategoriach produktu, następnie po ich opcjach, sprawdzenie czy są one wybrane i wygenerowania podsumowania w formie małego obiektu
    const thisProduct = this;


    const formData = utils.serializeFormToObject(thisProduct.form);

    const params = {};

    // for every category (param)...
    for (let paramId in thisProduct.data.params) {
      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      const param = thisProduct.data.params[paramId];

      params[paramId] = {
        label: param.label,
        options: {}
      };

      // for every option in this category
      for (let optionId in param.options) {
        const option = param.options[optionId];
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
        if (optionSelected) {
          params[paramId].options[optionId] = option.label;
        }
      }
    }
    return params;
  }
}

export default Product;