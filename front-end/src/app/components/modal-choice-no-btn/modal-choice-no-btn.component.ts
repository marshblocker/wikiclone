import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal-choice-no-btn',
  templateUrl: './modal-choice-no-btn.component.html',
  styleUrls: ['./modal-choice-no-btn.component.css']
})
export class ModalChoiceNoBtnComponent implements OnInit, AfterViewInit {

  @Input() modalId!: string;
  @Input() message!: string;
  @Input() showModal = false;
  @Output() onYesButtonClick = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const modal = document.querySelector(`#${this.modalId} .modal`) as HTMLDivElement;
    const closeButton = document.querySelector(`#${this.modalId} .close-button`) as HTMLSpanElement;
    const noButton = document.querySelector(`#${this.modalId} #no-button`) as HTMLButtonElement;
    const yesButton = document.querySelector(`#${this.modalId} #yes-button`) as HTMLButtonElement;

    const toggleModal = () => {
      modal.classList.toggle("show-modal");
    }

    const windowOnClick = (event: any) => {
      if (event.target === modal) {
          toggleModal();
      }
    }
  
    const YesButtonClicked = () => {
      toggleModal();
      this.onYesButtonClick.emit();
    }

    closeButton.addEventListener("click", toggleModal);
    noButton.addEventListener("click", toggleModal);
    yesButton.addEventListener("click", YesButtonClicked);
    window.addEventListener("click", windowOnClick);
  }
}
