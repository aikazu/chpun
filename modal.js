export class Modal {
    constructor(modalId, closeButton) {
        this.modal = document.getElementById(modalId);
        this.closeButton = closeButton;
        this.title = this.modal.querySelector('#modal-title');
        this.body = this.modal.querySelector('#modal-body');

        this.closeButton.addEventListener('click', () => this.hide());
        window.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.hide();
            }
        });
    }

    show(title, content) {
        this.title.innerHTML = title;
        this.body.innerHTML = content;
        this.modal.classList.remove('hidden');
    }

    hide() {
        this.modal.classList.add('hidden');
    }
}
