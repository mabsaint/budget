export var config = {
  "currency": "CHF",
    "oldcategories" : [ {'Жилище':[
        "Ток","Вода"
    ]},
       { 'Транспорт':[]},
        {'Храна':[]},
        {'Деца':[]},
        {'Лични':[]},
        {'Развлечения':[]},
        {'Банки':[]}],
    "categories":[
        {
            "title":"Жилище",
            "subcategories":["ток","вода","наем"]
        },
        {
            "title":"Транспорт",
            "subcategories":[]
        },{
            "title":"Храна",
            "subcategories":[]
        },{
            "title":"Деца",
            "subcategories":[]
        },{
            "title":"Лични",
            "subcategories":[]
        },{
            "title":"Развлечения",
            "subcategories":[]
        },{
            "title":"Банки",
            "subcategories":[]
        },
    ],
    "periods": [
        {'key':'', 'value': '-- none --'},
        {'key':'daily','value':'на ден'},
        {'key':'weekly','value':'на седмица'},
        {'key':'monthly','value':'на месец'},3
    ]
}
