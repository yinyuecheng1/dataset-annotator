import {Component, EventEmitter, HostListener, Input, Output, Renderer2} from "@angular/core";
import {Events} from "ionic-angular";
import {AnnotationsProvider} from "../../providers/annotations/annotations";

const KEYCODE_ENTER = 13;
const KEYCODE_ESCAPE = 27;

@Component({
    selector: "object-input",
    templateUrl: "object-input.html",
})
export class ObjectInputComponent {
    @Input() value: string;
    @Input() id: string;
    @Input() obj: Object;
    newValue: string;
    newId: string;
    @Output() valueChange = new EventEmitter<string>();
    @Output() idChange = new EventEmitter<string>();
    editing: boolean;
    idProvided: boolean;

    constructor(public events: Events,
                private renderer: Renderer2){
    }

    ngOnInit() {
        this.idProvided = this.id !== undefined;
        this.editing = true;
    }
    ngOnChanges(): void {
        this.newValue = this.value;
        this.newId = this.id;
    }

    accept(): void {
        this.value = this.newValue;
        this.id = this.newId;
        this.valueChange.emit(this.newValue);
        this.idChange.emit(this.newId);
        this.editing = false;
        AnnotationsProvider.lastLabel = this.value;
        this.renderCanvas();
    }

    cancel(): void {
        this.newValue = this.value;
        this.newId = this.id;
        this.editing = false;
    }

    @HostListener('keydown', ['$event']) onEnterPressed(e) {
        if (e.keyCode === KEYCODE_ENTER) {
            this.accept();
            this.renderer.removeClass(e.srcElement, 'editing');
        }
        else if (e.keyCode === KEYCODE_ESCAPE) {
            this.cancel();
        } else {
            this.renderer.addClass(e.srcElement, 'editing');
        }
    }

    onFocus() {
        if(this.obj) {
            AnnotationsProvider.selectedElement = this.obj;
            this.renderCanvas();
        }

    }

    renderCanvas() {
        this.events.publish('render-canvas');
    }


}