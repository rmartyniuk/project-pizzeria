import { settings, select, classNames } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';


const app = {
  initPages: function () {
    const thisApp = this;

    //mają przechowywać kontenery podstron i linki, które do nich prowadzą- dzięki temu znajdą się tam wszystkie dzieci .pages (#order i #booking)
    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    //z hasha url strony wydobywamy id podstrony, któa ma zostać otwarta jako domyślna
    const idFromHash = window.location.hash.replace('#/', '');

    //sprawdzamy czy któraś z podstron pasuje do tego id, które uzyskaliśmy z adresu strony. Jeżeli nie to zostanie otwarta pierwsza podstrona a jeżeli tak to zostanie otwarta ta podstrona, która pasowała do id uzyskanego z adresu strony
    let pageMatchingHash = thisApp.pages[0].id;
    for (let page of thisApp.pages) {
      if (page.id == idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }

    //aktywuujemy odpowiednią podstronę
    thisApp.activatePage(pageMatchingHash);

    //dodanie nasłuchiwaczy do linków, które odsyłają do podstron... 
    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        const clickedElement = this;
        event.preventDefault();

        /*...Na kliknięcie w taki link uzyskujemy id z atrybutu href tego linka*/
        const id = clickedElement.getAttribute('href').replace('#', '');

        /*...następnie aktywujemy odpowiednią podstronę*/
        thisApp.activatePage(id);

        /*change URL hash*/
        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function (pageId) {
    const thisApp = this;

    /* add class "active" to matching pages, remove from non-matching */
    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId);
      // czy klasa zostanie dodana czy nie może być kontrolowane za pomocą drugiego argumentu
    }

    /* add class "active" to matching links, remove from non-matching */
    for (let link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }

  },

  initMenu: function () {
    const thisApp = this;
    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
      //czy tutaj muszę dostać się do wartości?
    }
  },

  initData: function () {
    const thisApp = this;

    thisApp.data = {};

    const url = settings.db.url + '/' + settings.db.products;

    //za pomocą funkcji fetch wysyłamy zapytanie (request) pod podany adres endpointu
    fetch(url)

      //...po zakońćzeniu połączenia konwertujemy tę odpowiedź na obiekt JS-owy
      .then(function (rawResponse) {
        return rawResponse.json();
      })

      //...kiedy zakończy się konwertowanie jsona na jsa czyli po otrzymaniu skonwertowanej odpowiedzi, wyświetlamy ją w konsoli.
      .then(function (parsedResponse) {

        /*save parsedResponse as thisApp.data.products*/
        thisApp.data.products = parsedResponse;

        /*execute initMenu method*/
        thisApp.initMenu();
      });

    // console.log('thisApp.data', JSON.stringifi(thisApp.data));
  },

  initCart: function () {
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product);
    });
  },

  initBooking: function () {
    const thisApp = this;
    const bookingContainer = document.querySelector(select.containerOf.booking);
    thisApp.booking = new Booking(bookingContainer);
  },

  init: function () {
    const thisApp = this;

    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
  },
};

app.init();