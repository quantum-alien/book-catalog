(function () {
    'use strict';

    const API_BASE = 'api';

    const els = {
        searchInput: document.getElementById('searchInput'),
        genreFilter: document.getElementById('genreFilter'),
        sortField: document.getElementById('sortField'),
        sortOrderBtn: document.getElementById('sortOrderBtn'),
        sortArrow: document.querySelector('.sort-arrow'),
        resetBtn: document.getElementById('resetBtn'),
        bookList: document.getElementById('bookList'),
        resultCount: document.getElementById('resultCount'),
        emptyState: document.getElementById('emptyState'),
        modal: document.getElementById('bookModal'),
        modalTitle: document.getElementById('modalTitle'),
        modalAuthor: document.getElementById('modalAuthor'),
        modalYear: document.getElementById('modalYear'),
        modalGenre: document.getElementById('modalGenre'),
        modalCallNumber: document.getElementById('modalCallNumber'),
        modalDescription: document.getElementById('modalDescription'),
    };

    const state = {
        search: '',
        genre: '',
        sort: 'title',
        order: 'asc',
    };

    function debounce(fn, delay) {
        let timer = null;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function spineColors(seed) {
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = (hash << 5) - hash + seed.charCodeAt(i);
            hash |= 0;
        }
        const hue = Math.abs(hash) % 360;
        const a = `hsl(${hue}, 38%, 30%)`;
        const b = `hsl(${(hue + 25) % 360}, 45%, 14%)`;
        return { a, b };
    }

    function readStateFromUrl() {
        const params = new URLSearchParams(window.location.search);
        state.search = params.get('search') || '';
        state.genre = params.get('genre') || '';
        state.sort = params.get('sort') || 'title';
        state.order = params.get('order') || 'asc';
    }

    function writeStateToUrl() {
        const params = new URLSearchParams();
        if (state.search) params.set('search', state.search);
        if (state.genre) params.set('genre', state.genre);
        if (state.sort !== 'title') params.set('sort', state.sort);
        if (state.order !== 'asc') params.set('order', state.order);
        const qs = params.toString();
        const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
        window.history.replaceState(null, '', newUrl);
    }

    function syncControlsToState() {
        els.searchInput.value = state.search;
        els.genreFilter.value = state.genre;
        els.sortField.value = state.sort;
        updateSortArrow();
    }

    function updateSortArrow() {
        const labels = {
            title: ['A → Z', 'Z → A'],
            author: ['A → Z', 'Z → A'],
            published_year: ['Oldest first', 'Newest first'],
        };
        const [asc, desc] = labels[state.sort] || labels.title;
        els.sortArrow.textContent = state.order === 'asc' ? asc : desc;
    }

    async function fetchJson(url) {
        const response = await fetch(url);
        if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            throw new Error(body.error || `Request failed with status ${response.status}`);
        }
        return response.json();
    }

    async function loadGenres() {
        try {
            const genres = await fetchJson(`${API_BASE}/genres.php`);
            for (const genre of genres) {
                const option = document.createElement('option');
                option.value = genre;
                option.textContent = genre;
                els.genreFilter.appendChild(option);
            }
        } catch (err) {
            console.error('Could not load genres:', err);
        }
    }

    async function loadBooks() {
        const params = new URLSearchParams({
            search: state.search,
            genre: state.genre,
            sort: state.sort,
            order: state.order,
        });

        els.bookList.setAttribute('aria-busy', 'true');

        try {
            const books = await fetchJson(`${API_BASE}/books.php?${params.toString()}`);
            renderBooks(books);
        } catch (err) {
            els.bookList.innerHTML = '';
            els.resultCount.textContent = '';
            els.emptyState.hidden = false;
            els.emptyState.textContent = `Something went wrong loading the catalog: ${err.message}`;
        } finally {
            els.bookList.removeAttribute('aria-busy');
        }
    }

    async function loadBookDetail(id) {
        return fetchJson(`${API_BASE}/book.php?id=${encodeURIComponent(id)}`);
    }

    function renderBooks(books) {
        els.bookList.innerHTML = '';

        els.resultCount.textContent = books.length
            ? `${books.length} book${books.length === 1 ? '' : 's'} on the shelf`
            : '';

        els.emptyState.hidden = books.length > 0;
        if (!books.length) {
            els.emptyState.textContent = 'No books match your search. Try a different title, author, or genre.';
            return;
        }

        const fragment = document.createDocumentFragment();

        for (const book of books) {
            const { a, b } = spineColors(book.title + book.author);

            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'book-card';
            card.style.setProperty('--spine-a', a);
            card.style.setProperty('--spine-b', b);
            card.setAttribute('aria-label', `View details for ${book.title} by ${book.author}`);
            card.dataset.id = book.id;

            card.innerHTML = `
                <span class="book-card__year">${escapeHtml(String(book.published_year))}</span>
                <p class="book-card__title">${escapeHtml(book.title)}</p>
                <p class="book-card__author">${escapeHtml(book.author)}</p>
            `;

            card.addEventListener('click', () => openModal(book.id));
            fragment.appendChild(card);
        }

        els.bookList.appendChild(fragment);
    }

    let lastFocusedElement = null;

    async function openModal(id) {
        lastFocusedElement = document.activeElement;

        try {
            const book = await loadBookDetail(id);

            els.modalTitle.textContent = book.title;
            els.modalAuthor.textContent = book.author;
            els.modalYear.textContent = book.published_year;
            els.modalGenre.textContent = book.genre;
            els.modalCallNumber.textContent = book.call_number;
            els.modalDescription.textContent = book.description;

            els.modal.hidden = false;
            document.body.style.overflow = 'hidden';
            els.modal.querySelector('.modal__close').focus();
        } catch (err) {
            console.error('Could not load book details:', err);
        }
    }

    function closeModal() {
        els.modal.hidden = true;
        document.body.style.overflow = '';
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    const debouncedSearch = debounce(() => {
        state.search = els.searchInput.value.trim();
        writeStateToUrl();
        loadBooks();
    }, 300);

    els.searchInput.addEventListener('input', debouncedSearch);

    els.genreFilter.addEventListener('change', () => {
        state.genre = els.genreFilter.value;
        writeStateToUrl();
        loadBooks();
    });

    els.sortField.addEventListener('change', () => {
        state.sort = els.sortField.value;
        updateSortArrow();
        writeStateToUrl();
        loadBooks();
    });

    els.sortOrderBtn.addEventListener('click', () => {
        state.order = state.order === 'asc' ? 'desc' : 'asc';
        updateSortArrow();
        writeStateToUrl();
        loadBooks();
    });

    els.resetBtn.addEventListener('click', () => {
        state.search = '';
        state.genre = '';
        state.sort = 'title';
        state.order = 'asc';
        syncControlsToState();
        writeStateToUrl();
        loadBooks();
    });

    document.querySelectorAll('[data-close-modal]').forEach((el) => {
        el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !els.modal.hidden) {
            closeModal();
        }
    });

    async function init() {
        readStateFromUrl();
        await loadGenres();
        syncControlsToState();
        await loadBooks();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
