import { select, templates } from '../settings.js';
import AmountWidget from './AmountWidget.js';

class Booking {
  constructor(element) {
    const thisBooking = this;
    thisBooking.render(element);
    thisBooking.initWidgets();
  }

  render(element) {
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget(element);

    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmound = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);

    thisBooking.dom.hoursAmound = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmound = new AmountWidget(thisBooking.dom.peopleAmound);
    thisBooking.dom.peopleAmound.addEventListener('click', function () {

    });

    thisBooking.hoursAmound = new AmountWidget(thisBooking.dom.hoursAmound);
    thisBooking.dom.hoursAmound.addEventListener('click', function () {

    });

  }



}

export default Booking;