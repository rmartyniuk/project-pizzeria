/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  //Lokalizacja script w html, w którym znajdują się szablony, po identyfikatorze id.
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
      thisProduct.initAccordion();
      console.log('new Product:', thisProduct);
    }
    renderInMenu() {
      const thisProduct = this;

      /*generate HTML based on template- wygenerowanie kodu na podstawie szablonu*/
      const generatedHTML = templates.menuProduct(thisProduct.data);
      console.log('generatedHTML', generatedHTML);

      /*create element using utils.createElementFromHTML- utworzenie elementu za pomocą utils.createElementFromHTML*/
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);

      /*find menu container- znalezienie kontenera dla menu*/
      const menuContainer = document.querySelector(select.containerOf.menu);
      console.log('menuContainer', menuContainer);

      /*add element to menu- dodanie elementu do menu*/

      menuContainer.appendChild(thisProduct.element);

    }
    initAccordion() {
      const thisProduct = this;

      /* find the clickable trigger (the element that should react to clicking) */

      //znalezienie elementu, który ma reagować na kliknięcie- header
      //dlaczego niezbędne jest wpisanie w tym miejscu thisProduct.element??
      const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);

      /* START: add event listener to clickable trigger on event click -dodaj zdarzenie po kliknięciu w wyzwalacz- header */
      clickableTrigger.addEventListener('click', function (event) {

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
  }




  app.init();

}
