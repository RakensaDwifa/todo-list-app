// 1. Ambil elemen HTML
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');

// [BARU] Ambil elemen tombol filter
const filterAllBtn = document.getElementById('filterAll');
const filterActiveBtn = document.getElementById('filterActive');

// 2. Inisialisasi Data
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// [BARU] Variable untuk menyimpan status filter saat ini ('all' atau 'active')
let currentFilter = 'all'; 

renderTodos();

// --- EVENT LISTENERS ---

addBtn.addEventListener('click', function() {
    const taskValue = taskInput.value;
    const priority = prioritySelect.value;

    if (taskValue === "") {
        alert("Isi tugasnya dulu ya!");
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: taskValue,
        priority: priority,
        completed: false
    };

    todos.push(newTodo);
    saveAndRender();
    taskInput.value = "";
});

// [BARU] Logic untuk Tombol Filter
filterAllBtn.addEventListener('click', () => {
    currentFilter = 'all';
    updateFilterButtons(); // Ubah warna tombol
    renderTodos();         // Gambar ulang list
});

filterActiveBtn.addEventListener('click', () => {
    currentFilter = 'active';
    updateFilterButtons();
    renderTodos();
});

// --- FUNGSI UTAMA ---

function saveAndRender() {
    saveLocal();
    renderTodos();
}

function saveLocal() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// [BARU] Fungsi untuk mengubah warna tombol biar user tahu mana yang aktif
function updateFilterButtons() {
    if (currentFilter === 'all') {
        filterAllBtn.className = "text-xs bg-slate-800 text-white px-3 py-1 rounded-full transition-colors";
        filterActiveBtn.className = "text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full hover:bg-slate-200 transition-colors";
    } else {
        filterAllBtn.className = "text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full hover:bg-slate-200 transition-colors";
        filterActiveBtn.className = "text-xs bg-slate-800 text-white px-3 py-1 rounded-full transition-colors";
    }
}

function renderTodos() {
    todoList.innerHTML = "";

    // [BARU] Proses Penyaringan Data (Filtering)
    // Sebelum di-loop, kita saring dulu array-nya
    let filteredTodos = todos;

    if (currentFilter === 'active') {
        // Hanya ambil yang completed-nya false (belum selesai)
        filteredTodos = todos.filter(todo => todo.completed === false);
    }
    // Kalau filter 'all', kita pakai semua data (tidak perlu di-filter)

    // Sekarang kita loop array yang SUDAH DISARING (filteredTodos)
    filteredTodos.forEach(todo => {
        let colorClass = "bg-slate-50 border-slate-100";
        if (todo.priority === "High") colorClass = "bg-red-50 border-red-200";
        else if (todo.priority === "Medium") colorClass = "bg-yellow-50 border-yellow-200";

        const li = document.createElement('li');
        // Tambahkan logika 'hidden' jika kita sedang filter tapi item ini tidak sesuai (opsional, tapi cara di atas sudah cukup)
        li.className = `flex items-center justify-between p-3 rounded-lg border shadow-sm mb-3 transition-all ${colorClass} ${todo.completed ? 'opacity-50' : ''}`;

        li.innerHTML = `
            <div class="flex items-center gap-3">
                <input type="checkbox" class="w-5 h-5 rounded border-slate-300 text-blue-600 checkbox-todo" ${todo.completed ? 'checked' : ''}>
                <div>
                    <span class="text-slate-700 task-text font-medium ${todo.completed ? 'line-through text-slate-400' : ''}">${todo.text}</span>
                    <span class="block text-[10px] font-bold uppercase tracking-wide ${todo.priority === 'High' ? 'text-red-600' : (todo.priority === 'Medium' ? 'text-yellow-600' : 'text-slate-500')}">${todo.priority}</span>
                </div>
            </div>
            <button class="delete-btn text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        `;

        todoList.appendChild(li);

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            todos = todos.filter(t => t.id !== todo.id);
            saveAndRender();
        });

        const checkbox = li.querySelector('.checkbox-todo');
        checkbox.addEventListener('change', function() {
            todo.completed = this.checked;
            saveAndRender();
        });
    });
}