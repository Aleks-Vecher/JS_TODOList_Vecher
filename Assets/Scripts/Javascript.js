let task = [];

if (localStorage.getItem('Tasks')) {
    task = JSON.parse(localStorage.getItem('Tasks'));
}

function validate() {
    let $inputs = document.querySelectorAll('.input');

    function clearForm() {
        let $inputs = document.querySelectorAll('.input');

        $inputs.forEach($input => {
            $input.classList.remove('error_red');
            if ($input.type != "radio") $input.value = "";
        });
    }

    function checkForm() {
        let error = false;
        $inputs.forEach($input => {
            $input.classList.remove('error_red');
            if (!$input.value) {
                error = true;
                $input.classList.add('error_red');
            }
        })
        if (!error) {
            getOk()
        }
    }

    function getOk() {
        $('#exampleModal').modal('hide');

        let user = {};
        $inputs.forEach($input => {
            if ($input.checked || $input.classList.contains('text')) {
                user[$input.dataset.type] = $input.value;
            }
        });
        user.type = "act";
        task.push(user);
        console.log(user)
        localStorage.setItem('Tasks', JSON.stringify(task));

        table.drowTask();
        clearForm();
    }
    return {
        clearForm,
        checkForm
    }
}

const modul = validate();

function drowTable() {

    const filteredArr = (type) => {
        return task.filter(item => {
            if (item.type === type) {
                return item
            }
        })
    }

    const drowTask = () => {
        let mass = filteredArr("act");

        let $table = document.querySelector(".act");
        $table.innerHTML = "";

        mass.forEach((item, index) => {
            $table.innerHTML += `<tr>
        <th scope="row">${index + 1}</th>
        <td class=${item.priority === "Urgent" ? "edit2" : ""}>${item.name}</td>
        <td class=${item.priority === "Urgent" ? "edit2" : ""}>${item.description}</td>
        <td class='icon_table'>
            <div class="block_icon">
                <div><i data-action="done" class="fas fa-check-circle"></i></div>
                <div><i data-action="edite" class="fas fa-edit"></i></div>
                <div><i data-action="remove" class="fas fa-trash-alt"></i></div>
            </div>
        </td>
    </tr > `;
        })
        localStorage.setItem("Tasks", JSON.stringify(task))
    }

    const drowDone = (type) => {
        let mass = filteredArr("done");

        let $table = document.querySelector(".done");
        $table.innerHTML = "";

        mass.forEach((item, index) => {
            $table.innerHTML += `<tr>
        <th scope="row">${index + 1}</th>
        <td>${item.name}</td>
        <td>${item.description}</td>
        <td class='icon_table'>
            <div class="block_icon">
                <div><i data-action="edite" class="fas fa-edit"></i></div>
                <div><i data-action="remove" class="fas fa-trash-alt"></i></div>
            </div>
        </td>
    </tr > `;
        })
        localStorage.setItem("Tasks", JSON.stringify(task))
    }

    const drowRemove = (type) => {
        let mass = filteredArr("remove");

        let $table = document.querySelector(".remove");
        $table.innerHTML = "";

        mass.forEach((item, index) => {
            $table.innerHTML += `<tr>
        <th scope="row">${index + 1}</th>
        <td>${item.name}</td>
        <td>${item.description}</td>
        <td class='icon_table'>
            <div class="block_icon">
                <div><i data-action="renew"class="fas fa-arrow-left"></i></div>
                <div><i data-action="del" class="fas fa-trash-alt"></i></div>
            </div>
        </td>
    </tr > `;
        })
        localStorage.setItem("Tasks", JSON.stringify(task))
    }

    return {
        drowTask,
        drowDone,
        drowRemove
    }
}

const table = drowTable();
table.drowTask();
table.drowDone();
table.drowRemove();

document.addEventListener('click', function (e) {
    if (e.target.dataset.close) {
        modul.clearForm()
    }

    if (e.target.classList.contains('btn_addClose')) {
        modul.checkForm();
    }

    function selectTypeTrTable(trType) {
        let trNameValue = e.target.closest('tr').cells[1].innerHTML;
        let trDescriptionValue = e.target.closest('tr').cells[2].innerHTML;
        task.forEach(item => {
            if (item.name === trNameValue && item.description === trDescriptionValue) {
                item.type = trType;
            }
        })
        task.filter(item => item.type != '');
    }

    // здесь я не смог сохранить изменения в массив task для отрисовки. вопрос, как заменить старое значение на изменённое.

    function editTdTable() {
        let trNameValue = [...e.target.closest('tr').children].slice(0, 3);
        let [thItem, tdName, tdDescription] = trNameValue;

        [tdName, tdDescription].forEach(item => {
            item.setAttribute('contentEditable', true);
            item.classList.toggle('edit');
            e.target.classList.toggle('color_icon');
            tdName.focus();
        });

        observer.observe(e.target.closest('tr'), {
            subtree: true,
            characterDataOldValue: true
        })

        if (!tdName.classList.contains('edit')) {
            console.log(tdName.innerHTML);
            [tdName, tdDescription].forEach(item => item.removeAttribute('contentEditable'));
        }
    }


    if (e.target.dataset.action === "done") {
        selectTypeTrTable('done')
        table.drowDone();
        table.drowTask();
    }

    if (e.target.dataset.action === "remove") {
        selectTypeTrTable('remove')
        table.drowRemove();
        table.drowDone();
        table.drowTask();
    }

    if (e.target.dataset.action === "renew") {
        selectTypeTrTable('done')
        table.drowRemove();
        table.drowDone();
    }

    if (e.target.dataset.action === "del") {
        selectTypeTrTable('')
        table.drowRemove();
    }

    if (e.target.dataset.action === "edite") {
        editTdTable();
    }
}
);

// это относсится к editTdTable()

let observer = new MutationObserver(mutationRecords => {
    console.log(mutationRecords[0].oldValue);
})

