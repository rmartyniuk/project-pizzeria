/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  //Lokalizacja script w html, w którym znajdują się szablony, po identyfikatorze id. Zbiór danych select powstał po to aby odnaleźć konkretne miejsca w htmlu po klasie i zapisać je w stałych do wykorzystania w JS? CZyli dane zostały spisane z szablonu, który powstał wcześniej, opisanego w html i przepisane tutaj? 
  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    //tworzy szablon o nazwie menuProduct i wyszukuje contenera z szablonem po ustalonej w stałej select właściwości menuProduct i pobiera informacje o jego budowie
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  const app = {
    initMenu: function () {
      const thisApp = this;
      console.log('thisApp.data:', thisApp.data);
      for (let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
        //czy tutaj muszę dostać się do wartości?
      }
    },
    initData: function () {
      const thisApp = this;

      thisApp.data = dataSource;
    },
    init: function () {
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);
      thisApp.initData();
      thisApp.initMenu();
    },
  };

  class Product {
    constructor(id, data) {
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.processOrder();
      console.log('new Product:', thisProduct);
    }
    renderInMenu() {
      const thisProduct = this;

      /*generate HTML based on template- wygenerowanie kodu na podstawie szablonu*/
      const generatedHTML = templates.menuProduct(thisProduct.data);
      // console.log('generatedHTML', generatedHTML);

      /*create element using utils.createElementFromHTML- utworzenie elementu za pomocą utils.createElementFromHTML*/
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);

      /*find menu container- znalezienie kontenera dla menu*/
      const menuContainer = document.querySelector(select.containerOf.menu);
      // console.log('menuContainer', menuContainer);

      /*add element to menu- dodanie elementu do menu*/

      menuContainer.appendChild(thisProduct.element);
    }

    getElements() {
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      // console.log('thisProduct.accordionTrigger', thisProduct.accordionTrigger);

      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      // console.log('thisProduct.form', thisProduct.form);

      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      // console.log('thisProduct.formInputs', thisProduct.formInputs);

      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);

      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    }

    initAccordion() {
      const thisProduct = this;

      /* find the clickable trigger (the element that should react to clicking) */

      //znalezienie elementu, który ma reagować na kliknięcie- header
      //dlaczego niezbędne jest wpisanie w tym miejscu thisProduct.element??
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
      console.log('initOrderForm-thisProduct', thisProduct);

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
      });
    }
    processOrder() {
      const thisProduct = this;

      // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData', formData);

      // set price to default price- tutaj będzie cena produktu
      let price = thisProduct.data.price;

      // for every category (param)...
      for (let paramId in thisProduct.data.params) {
        // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
        const param = thisProduct.data.params[paramId];
        // console.log(paramId, param);

        // for every option in this category
        for (let optionId in param.options) {
          // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
          //option- ma dostać się do całego obiektu dostępnego pod określoną właściwością
          const option = param.options[optionId];
          // console.log(optionId, option);

          // NEW czy w formData istnieje właściwość o nazwie zgodnej z nazwą kategorii
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
          if (optionSelected) {
            if (!option.default) {
              price += option.price;
            }
          } else if (option.default) {
            price -= option.price;
          }
        }
      }
      // update calculated price in the HTML
      thisProduct.priceElem.innerHTML = price;
    }
  }
  app.init();
}