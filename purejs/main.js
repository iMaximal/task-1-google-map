'use strict';

(function () {

    // проверяем поддержку
    if (!Element.prototype.matches) {

        // определяем свойство
        Element.prototype.matches = Element.prototype.matchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector;

    }

})();

// Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/prepend()/prepend().md
(function (arr) {
    arr.forEach(function (item) {
        if (item.hasOwnProperty('prepend')) {
            return;
        }
        Object.defineProperty(item, 'prepend', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function prepend() {
                var argArr = Array.prototype.slice.call(arguments),
                    docFrag = document.createDocumentFragment();

                argArr.forEach(function (argItem) {
                    var isNode = argItem instanceof Node;
                    docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                });

                this.insertBefore(docFrag, this.firstChild);
            }
        });
    });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);

(function () {

    // проверяем поддержку
    if (!Element.prototype.closest) {

        // реализуем
        Element.prototype.closest = function (css) {
            var node = this;

            while (node) {
                if (node.matches(css)) return node;
                else node = node.parentElement;
            }
            return null;
        };
    }

})();

// In the following example, markers appear when the user clicks on the map.
// The markers are stored in an array.
// The user can then click an option to hide, show or delete the markers.
var map;
var markers = [];
var infoWindow;
var editingLi;

/**
 * Initialize google map
 */
function initMap() {
    var devvela = {lat: 56.840375, lng: 60.568951};

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: devvela,
        mapTypeId: 'terrain'
    });


    // Define an info window on the map.
    infoWindow = new google.maps.InfoWindow();

    // This event listener will call addMarker() when the map is clicked.
    map.addListener('click', function (event) {
        addMarker(event.latLng);
    });

    // Adds a marker at the center of the map.
    // addMarker(devvela);

}


// Adds a marker to the map and push to the array.
function addMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        title: showTooltip(),
        notes: {}
    });

    markers.push(marker);

    marker.addListener('click', function () {
        var contentString = marker.title;
        // Set the info window's content and position.
        infoWindow.setContent(contentString);
        infoWindow.open(map, marker);
        markPoint(marker.listId);
    });

}


// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}

// Delete last marker
function deleteLastMarker() {
    markers[markers.length - 1].setMap(null);
    markers.pop();
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
    var ulNode = document.querySelector('.right-side__list');
    while (ulNode.firstChild) {
        ulNode.removeChild(ulNode.firstChild);
    }
}

// Show dialog window. Ask the name for new Point.
function showTooltip() {
    showHide();
    var tempDiv = document.createElement('div');
    tempDiv.className = 'tooltip';
    var input = document.createElement('input');
    input.type = 'text';
    input.minLength = 1;
    input.maxlength = 256;
    input.className = 'input__point ';
    input.required = true;
    input.placeholder = 'Введите описание точки (например: адрес)';
    tempDiv.appendChild(input);
    document.getElementById('right-side').prepend(tempDiv);
    input.focus();
    input.insertAdjacentHTML("afterEnd",
        '<div class="edit-controls">' +
        '<button class="edit-ok">OK</button>' +
        '<button class="edit-cancel">CANCEL</button>' +
        '</div>'
    );

}

function deleteTooltip() {
    var rightSide = document.getElementById('right-side');
    rightSide.removeChild(rightSide.firstElementChild);
}

function createNewPoint(text, uniqueId) {
    // body
    var liPoint = document.createElement('li');
    liPoint.className = 'right-side__point';
    liPoint.dataset.uniqueId = uniqueId;
    var liContent = document.createElement('div');
    liContent.innerHTML = text;
    liPoint.appendChild(liContent);

    // controls
    // liPoint.insertAdjacentHTML('beforeEnd', '<div><a href="" class="controls" title="Edit">Edit</a> <a href="" class="controls" title="Add">Add</a> <a href="" class="controls" title="Remove">Remove</a></div>');
    var controls = document.createElement('div');
    controls.className = 'controls-container';
    controls.innerHTML = '<a href="" class="controls" title="Edit">Edit</a> <a href="" class="controls" title="Add">Add</a> <a href="" class="controls" title="Remove">Remove</a>';

    liPoint.appendChild(controls);
    document.getElementById('right-side').firstElementChild.prepend(liPoint);
}

function createPointChild(liContainer, liKey) {
    editingLi = true;
    var ul = document.createElement('ul');
    var li = document.createElement('li');
    var inputContainer = document.createElement('div');
    var input = document.createElement('input');
    input.type = 'text';
    input.minLength = 1;
    input.maxlength = 256;
    input.className = 'input__point ';
    ul.dataset.parentUniqueId = liKey;
    inputContainer.appendChild(input);
    li.appendChild(inputContainer);
    ul.appendChild(li);
    liContainer.appendChild(ul);
    input.insertAdjacentHTML("afterEnd",
        '<div class="edit-controls">' +
        '<button class="edit-child-ok">OK</button>' +
        '<button class="edit-child-cancel">CANCEL</button>' +
        '</div>'
    );
}


function showHide() {
    var hide = document.createElement('div');
    hide.id = 'box';
    document.body.appendChild(hide);
}

function cancelHide() {
    document.body.removeChild(document.body.lastElementChild);
}

// get actual point ID in array markers
function getPointId(uniqueId) {
    var markersCount = markers.length - 1;
    for (var j = markersCount; j > -1; j--) {
        if (markers[j].listId == uniqueId) {
            return j;
        }
    }
}

function goToPoint(key) {
    // map.panTo(markers[0].position);
    map.setCenter(markers[key].position);
}

function markPoint(uniqueId) {
    var lastChecked = document.querySelector('.right-side__point.checked');
    if (lastChecked) {
        lastChecked.classList.remove('checked');
    }
    document.querySelector('[data-unique-id="' + uniqueId + '"]').classList.add('checked');
    // var markId = getPointId(uniqueId);
    // infoWindow.open(map, markers[markId]);
}

function deletePoint(uniqueId) {
    var id = getPointId(uniqueId);
    markers[id].setMap(null);
    markers.splice(id, 1);
    var deleteblePoint = document.querySelector('[data-unique-id="' + uniqueId + '"]');
    deleteblePoint.parentNode.removeChild(deleteblePoint);
}

function createNoteInPoint(uniqueId, text, storeId) {
    var id = getPointId(uniqueId);
    Object.defineProperty(markers[id].notes, (String(storeId)), {
        value: text
    });
}

function removeNotes(elem) {
    var removeNote = elem.closest('ul');
    removeNote.parentNode.removeChild(removeNote);
}

function makeLiEditable(div, uniqueId, noteId) {
    // li change -> first DIV container
    var id = getPointId(uniqueId);

    editingLi = {
        elem: div,
        data: div.innerHTML
    };

    div.classList.add('edit-li');

    var textArea = document.createElement('textarea');
    textArea.style.width = div.clientWidth - 5 + 'px';
    textArea.style.height = div.clientHeight + 10 + 'px';
    textArea.className = 'edit-area';

    // check Point or Note
    if (noteId) {
        textArea.value = markers[id].notes[noteId];
    } else {
        textArea.value = markers[id].title;
    }

    div.innerHTML = '';
    div.appendChild(textArea);
    textArea.focus();

    div.insertAdjacentHTML("beforeEnd",
        '<div class="edit-controls"><button class="edit-point-ok">OK</button><button class="edit-point-cancel">CANCEL</button></div>'
    );

}

function finishLiEdit(div, isOk) {
    if (isOk) {
        // if Point
        if (div.parentNode.hasAttribute('data-unique-id')) {
            // div container = textarea
            div.innerHTML = div.firstElementChild.value;

            // if Notes
        } else {
            div.innerHTML = div.firstElementChild.value;
        }
    } else {
        // if cancel -> old value
        div.innerHTML = editingLi.data;
    }

    div.classList.remove('edit-li'); // remove edit class
    editingLi = null;
}

/**
 *  Global handlers for #right-side
 */
document.getElementById('right-side').addEventListener('click', taskWatcher);

function taskWatcher(event) {

    /**
     *  Handlers for new Point
     */
    if (event.target.className === 'edit-cancel' && event.target.tagName === 'BUTTON') {
        deleteLastMarker();
        deleteTooltip();
        cancelHide();
    }

    if (event.target.className === 'edit-ok' && event.target.tagName === 'BUTTON') {
        var rand = Math.random();
        var lastPointName = event.target.parentNode.previousElementSibling.value || '' + parseInt(rand * 1000);
        markers[markers.length - 1].title = lastPointName;
        markers[markers.length - 1].listId = rand;
        deleteTooltip();
        createNewPoint(lastPointName, rand);
        cancelHide();
        lastPointName = null;
    }

    /**
     *  Handler go to Point from list
     */
    if (event.target.parentNode.className === 'right-side__point') {
        var target = event.target.parentNode;
        var markerId = getPointId(target.dataset.uniqueId);
        goToPoint(markerId);
        markPoint(target.dataset.uniqueId);
    }

    /**
     *  Handlers for Edit Point List
     */
    if (event.target.className === 'controls' && event.target.getAttribute('title') === 'Edit') {
        event.preventDefault();

        if (editingLi) return; // already editing
        var liPointContainer = event.target.closest('li').firstElementChild;
        var liPointKey = event.target.closest('li').getAttribute('data-unique-id');
        makeLiEditable(liPointContainer, liPointKey);

    }

    if (event.target.className === 'edit-point-ok') {
        event.preventDefault();

        finishLiEdit(editingLi.elem, true);
    }

    if (event.target.className === 'edit-point-cancel') {
        event.preventDefault();

        finishLiEdit(editingLi.elem, false);
    }

    /**
     *  Handlers for create Point Notes
     */
    if (event.target.className === 'edit-child-ok') {
        event.preventDefault();
        // div -> input
        var input = event.target.parentNode.previousElementSibling;
        if (input.value === '') {
            input.value = 'Обработка исключения';
        }
        var liChild = event.target.closest('li');
        // create id for store in Object markers.notes
        var storeId = Math.random();
        storeId = '' + parseInt(storeId * 1000);
        liChild.parentNode.dataset.storeId = storeId;

        // div container
        var liChildContainer = document.createElement('div');

        liChildContainer.innerHTML = input.value;
        liChild.appendChild(liChildContainer);
        liChild.firstElementChild.parentNode.removeChild(liChild.firstElementChild);

        var controls = document.createElement('div');
        controls.className = 'controls-container';
        controls.innerHTML = '<a href="" class="controls" title="EditNotes">Edit</a> <a href="" class="controls" title="RemoveNotes">Remove</a>';

        liChild.appendChild(controls);

        var uniqueId = liChild.parentNode.getAttribute('data-parent-unique-id');
        createNoteInPoint(uniqueId, input.value, storeId);
        editingLi = null;
    }

    if (event.target.className === 'edit-child-cancel') {
        event.preventDefault();
        var el = event.target.closest('ul');
        el.parentNode.removeChild(el);
        editingLi = null;
    }


    if (event.target.className === 'controls' && event.target.getAttribute('title') === 'Add') {
        event.preventDefault();
        if (editingLi) return; // one more
        var liContainer = event.target.parentNode.parentNode;
        var liKey = liContainer.getAttribute('data-unique-id');
        createPointChild(liContainer, liKey);

    }

    if (event.target.className === 'controls' && event.target.getAttribute('title') === 'Remove') {
        event.preventDefault();
        if (editingLi) return;
        var uniqueId = event.target.closest('.right-side__point').getAttribute('data-unique-id');
        deletePoint(uniqueId);
    }

    /**
     *  Handlers for Notes
     */
    if (event.target.className === 'controls' && event.target.getAttribute('title') === 'EditNotes') {
        event.preventDefault();

        if (editingLi) return; // already editing
        var liNoteContainer = event.target.closest('li').firstElementChild;
        var liNoteKey = event.target.closest('ul').getAttribute('data-parent-unique-id');
        var noteId = event.target.closest('ul').getAttribute('data-store-id');
        makeLiEditable(liNoteContainer, liNoteKey, noteId);

    }


    if (event.target.className === 'controls' && event.target.getAttribute('title') === 'RemoveNotes') {
        event.preventDefault();
        if (editingLi) return;
        removeNotes(event.target);
    }


}


