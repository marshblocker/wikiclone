import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, AfterViewInit {
  @Input() modalId!: string;
  @Input() message!: string;
  @Input() buttonMessage!: string;
  @Output() onYesButtonClick = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const modal = document.querySelector(`#${this.modalId} .modal`) as HTMLDivElement;
    const trigger = document.querySelector(`#${this.modalId} .trigger`) as HTMLButtonElement;
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

    trigger.addEventListener("click", toggleModal);
    closeButton.addEventListener("click", toggleModal);
    noButton.addEventListener("click", toggleModal);
    yesButton.addEventListener("click", YesButtonClicked);
    window.addEventListener("click", windowOnClick);
  }
}
