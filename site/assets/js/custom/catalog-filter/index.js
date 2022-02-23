const dataControlSelectCollection = document.querySelectorAll('select.catalog-data-control');
const carBrandFilter = document.querySelectorAll('.car-brand-filter');
const carModelFamilyFilter = document.querySelectorAll('.car-model-family-filter');
const dataControlCheckboxCollection = document.querySelectorAll('.catalog-filter-checkbox-control');
const catalogProductNameSearchInput = document.getElementById('catalog-product-name-search-input');
const catalogProductNameSearchBtnInitiator = document.getElementById('catalog-product-name-search-initiator');
const dataControlTextInputCollection = document.querySelectorAll('input[type="text"].catalog-data-control');
const dataControlForm = () => document.querySelectorAll('form.data-control-form');
const dataControlFormSubmitButtonCollection = () => document.querySelectorAll('.data-control-form-submit-button');

const getResource = async (payload, uri = '/api/shop/') => {
    const response = await fetch(uri, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        }
    });

    if (! response.ok) {
        throw new Error(`Error fetch ${response.status}`);
    }

    return await response.json();
};

const getPayload = (b) => {
    const {
        payload = {}
    } = b;

    return payload;
};

const getDataSet = (pl) => {
    const {
        payload = []
    } = pl;

    return payload;
}


const disableDataControls = () => {
    dataControlSelectCollection.forEach(select => {
        select.setAttribute('disabled', '');
    });

    if (catalogProductNameSearchInput) {
        catalogProductNameSearchInput.setAttribute('disabled', '');
    }

    if (catalogProductNameSearchBtnInitiator) {
        catalogProductNameSearchBtnInitiator.setAttribute('disabled', '');
    }

    dataControlFormSubmitButtonCollection().forEach(button => {
        button.setAttribute('disabled', '');
    });
};


const enableDataControls = () => {
    dataControlSelectCollection.forEach(select => {
        select.removeAttribute('disabled');
    });

    if (catalogProductNameSearchInput) {
        catalogProductNameSearchInput.removeAttribute('disabled');
    }

    if (catalogProductNameSearchBtnInitiator) {
        catalogProductNameSearchBtnInitiator.removeAttribute('disabled');
    }

    dataControlFormSubmitButtonCollection().forEach(button => {
        button.removeAttribute('disabled');
    });
};


const handleChangeDataControl = (e, immediateJump = false) => {

    if (   (typeof e.target === 'object')
        && (typeof e.target.getAttribute('id') === 'string')
        && (['filter-select-car-brand', 'filter-select-car-model-family'].includes(e.target.getAttribute('id')))
    ) {
        return;
    }

    let payload = {
        page: '1',
        options: {}
    };

    disableDataControls();

    dataControlSelectCollection.forEach(select => {

        let paramName = select.getAttribute('data-parameter-name');

        let activeIndex = select.selectedIndex;

        let option = select.querySelectorAll('option')[activeIndex];

        if (typeof paramName === 'string') {
            if (['vendor', 'categoryId'].includes(paramName)) {
                payload[paramName] = option.getAttribute('value');
            } else if (['car_brand', 'car_model_family', 'car_model'].includes(paramName)) {
                try {
                    let val = parseInt(option.getAttribute('value'));

                    if ((typeof val === 'number')
                        && (val > 0)
                    ) {
                        payload['options'][paramName] = [`${val}`];
                    }
                } catch (e) {
                    throw new Error(`Error parseInt value ${option.getAttribute('value')}`)
                }
            } else {
                if (   typeof option.getAttribute('value') == "string"
                    && option.getAttribute('value').length > 0
                ) {
                    payload['options'][paramName] = [option.getAttribute('value')];
                }
            }
        }
    });

    const checkBoxCollection = document.querySelectorAll('.catalog-filter-checkbox-control-active');
    checkBoxCollection.forEach(checkbox => {
        const pName = checkbox.getAttribute('data-parameter-name');
        const value = checkbox.getAttribute('data-value');

        if (   Array.isArray(payload['options'][pName])
            && !payload['options'][pName].includes(value)
        ) {
            payload['options'][pName].push(value);
        } else {
            payload['options'][pName] = [value];
        }
    });


    if (catalogProductNameSearchInput) {
        const catalogProductNameSearchInputValue = catalogProductNameSearchInput.value ?? '';

        if (catalogProductNameSearchInputValue.length > 0) {
            payload['options']['product_name'] = catalogProductNameSearchInputValue;
        }
    }


    dataControlTextInputCollection.forEach(
        textInput => {

        const value = textInput.value ?? '';
        const parameterName = textInput.getAttribute('data-parameter-name') ?? '';

        if (   (parameterName.length > 0)
            && (value.length > 0)
        ) {
            payload['options'][parameterName] = value;
        }
    });


    getResource(payload, 'assets/components/assortiment/catalog/')
      .then(body => {
        console.log(body);

        const {
            payload = {}
        } = body;

        const {
            uri = '/'
        } = payload;

        if (immediateJump) {
            document.location.href = uri;
            return;
        }

        enableDataControls();

        // const container =    typeof e.target !== 'undefined'
        //                   && typeof e.target.parentNode === 'object' ? e.target.parentNode : e.parentNode.parentNode;
        // const childContainer = container.querySelector('.catalog-item-parameter-caption');
        // setRedirectTriggerState(true, container.offsetTop, childContainer.offsetHeight);
        // setRedirectTriggerLink(uri);
    });
};


const handleChangeCarBrand = (e) => {
    let toServer = {
        "method": "shop.carfiltermodelfamily.list",
        "car_brand_id": e.target.value
    }

    if(e.target.value == 0){
        const target = document.getElementById('filter-select-car-model');
        target.innerHTML = '';
        target.append(new Option("Укажите кузов", ''));
    }

    getResource(toServer).then(body => {

        const modelFamilyDict = getDataSet(getPayload(body));

        const target = document.getElementById('filter-select-car-model-family');
        if (typeof target !== 'object') {
            return;
        }

        target.innerHTML = '';
        target.append(new Option("Укажите модель", ''));

        modelFamilyDict.map((Row, i) => {
            target.append(new Option(Row.Name, Row.id));
        });
    });
};


const handleChangeCarModelFamily= (e) => {
    let toServer = {
        "method": "shop.carfiltermodel.list",
        "car_modelfamily_id": e.target.value
    }

    getResource(toServer).then(body => {
            const modelFamilyDict = getDataSet(getPayload(body));
            const target = document.getElementById('filter-select-car-model');
            if (typeof target !== 'object') {
                return;
            }

            target.innerHTML = '';
            target.append(new Option("Укажите кузов", ''));
            modelFamilyDict.map((Row, i) => {
                target.append(new Option(Row.Name, Row.id));
            });
        });
};

// const removeButton = document.getElementById('remove-all');

// const resetFilters = () => {
//     dataControlSelectCollection.forEach(select => {
//         if (!['categoryId'].includes(select.getAttribute('data-parameter-name'))) {
//             select.selectedIndex = 0;
//         }
//     });
// }
//
// removeButton.addEventListener('click', resetFilters);

const setRedirectTriggerLink = (uri) => {
    const triggerLink = document.querySelector('.catalog-filter-redirect-trigger-link');
    const triggerLinkMobile = document.querySelector('.catalog-filter-redirect-trigger-link-mobile');

    triggerLink.setAttribute('href', uri);

    triggerLinkMobile.setAttribute('href', uri);
};


const setRedirectTriggerState = (isVisible, container, height) => {
    const trigger = document.querySelector('.catalog-filter-redirect-trigger');

    const top = container + height;

    if (isVisible) {
        trigger.classList.add('trigger-visible');
        trigger.setAttribute('style', 'top: ' + top + 'px');
    } else {
        trigger.classList.remove('trigger-visible');
    }
};


dataControlSelectCollection.forEach(item => {
    item.addEventListener('change', handleChangeDataControl);
});


const handleCatalogFilterCheckboxClick = (e) => {
    let target = undefined;

    if (e.target.classList.contains('catalog-filter-checkbox-control')) {
        target = e.target;
    } else {
        target = e.target.parentNode;
    }

    const getCheckboxIcon = (isActive) => {
        if (isActive) {
            return `<i class="fa fa-check-square-o text-blue"></i>`;
        } else {
            return `<i class="fa fa-square-o"></i>`;
        }
    };

    const getContent = (isActive, caption) => {
        return getCheckboxIcon(isActive) + `&nbsp; <span>${caption}</span>`;
    };

    let state = target.classList.contains('catalog-filter-checkbox-control-active');

    state = !state;

    if (state) {
        target.classList.add('catalog-filter-checkbox-control-active');
    } else {
        target.classList.remove('catalog-filter-checkbox-control-active');
    }

    target.innerHTML = getContent(state, target.getAttribute('data-caption'));

    handleChangeDataControl(target);
};


dataControlCheckboxCollection.forEach(checkbox => {
    checkbox.addEventListener('click', handleCatalogFilterCheckboxClick);
});


carBrandFilter.forEach(item => {
    item.addEventListener('change', handleChangeCarBrand);
});

carModelFamilyFilter.forEach(item => {
    item.addEventListener('change', handleChangeCarModelFamily);
});


const filterShow = () => {
    const filter = document.getElementById('filter');
    const filterControlButtonsContainer = document.getElementById('catalog-filter-control-buttons-container');
    const filterShowButtonContainer = document.getElementById('catalog-filter-show-button-container');

    filterShowButtonContainer.classList.add('hidden');
    filterControlButtonsContainer.classList.remove('hidden');

    filter.classList.add('filter-show');
};

const filterClose = () => {
    const filter = document.getElementById('filter');
    const filterControlButtonsContainer = document.getElementById('catalog-filter-control-buttons-container');
    const filterShowButtonContainer = document.getElementById('catalog-filter-show-button-container');

    filterControlButtonsContainer.classList.add('hidden');
    filterShowButtonContainer.classList.remove('hidden');

    filter.classList.remove('filter-show');
};


const addOnClickListenerOnCatalog = () => {
    if (catalogProductNameSearchBtnInitiator) {
        catalogProductNameSearchBtnInitiator.addEventListener('click', e => handleChangeDataControl(e, true))
    }
};
addOnClickListenerOnCatalog();


const addDataControlFormOnSubmitListener = () => {
    dataControlForm().forEach(form => {
        form.addEventListener('submit', e => {

            e.preventDefault();

            handleChangeDataControl(e, true);
        });
    });
};
addDataControlFormOnSubmitListener();


const initDataControlFormSubmitButtons = () => {
    dataControlFormSubmitButtonCollection().forEach(item => {
        item.addEventListener('click', e => {
            handleChangeDataControl(e, true);
        });
    });
};
initDataControlFormSubmitButtons();

// document.getElementById('filter-button').addEventListener('click', filterShow);
// document.getElementById('filter-close').addEventListener('click', filterClose);
