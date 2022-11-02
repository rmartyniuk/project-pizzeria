import { settings, select } from '../settings.js';

import BaseWidget from './BaseWidget.js';

//klasa AmountWidget jest rozszerzeniem klasy BaseWidget (extens)
class AmountWidget extends BaseWidget {
  constructor(element) {

    //Pierwszą rzeczą przy wywołaniu konstruktora klasy dziedziczącej/pochodnej(AmountWidget) jest wywołanie konstruktora klasy nadrzednej/bazowej(BaseWidget), co robi się za pomocą wyrażenia "super". WrapperElement jes przekazany do konstruktora klasy AmountWidget jako "element", drugi argument to początkowa wartość widgetu
    super(element, settings.amountWidget.defaultValue);
    //'elementem' ma być div
    const thisWidget = this;

    thisWidget.getElements(element);

    thisWidget.initActions();
  }
  getElements() {
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);

    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);

    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }

  isValid(value) {
    //!isNAN- czy value nie jest nie liczbą?
    return !isNaN(value)
      && value >= settings.amountWidget.defaultMin
      && value <= settings.amountWidget.defaultMax;
  }

  renderValue() {
    const thisWidget = this;

    thisWidget.dom.input.value = thisWidget.value;
  }

  initActions() {
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function () {
      thisWidget.value = thisWidget.dom.input.value;
    });

    thisWidget.dom.linkDecrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });

    thisWidget.dom.linkIncrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }
}

export default AmountWidget;