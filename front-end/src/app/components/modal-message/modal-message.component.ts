import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-message',
  templateUrl: './modal-message.component.html',
  styleUrls: ['./modal-message.component.css']
})
export class ModalMessageComponent implements OnInit, AfterViewInit {
  @Input() modalId!: string;
  @Input() message!: string;
  @Input() showModal = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const modal = document.querySelector(`#${this.modalId} .modal`) as HTMLDivElement;
    const closeButton = document.querySelector(`#${this.modalId} .close-button`) as HTMLSpanElement;
    const okButton = document.querySelector(`#${this.modalId} #ok-button`) as HTMLButtonElement;

    const toggleModal = () => {
      modal.classList.toggle("show-modal");
    }

    const windowOnClick = (event: any) => {
      if (event.target === modal) {
          toggleModal();
      }
    }
  
    closeButton.addEventListener("click", toggleModal);
    okButton.addEventListener("click", toggleModal);
    window.addEventListener("click", windowOnClick);
  }
  

}
