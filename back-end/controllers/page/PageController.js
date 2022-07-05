class PageController {
    constructor(pageReadController, pageCreateController, 
                pageUpdateController, pageDeleteController) {
        this.pageReadController = pageReadController;
        this.pageCreateController = pageCreateController;
        this.pageUpdateController = pageUpdateController;
        this.pageDeleteController = pageDeleteController;
    }
}

module.exports = PageController;