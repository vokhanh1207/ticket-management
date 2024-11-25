"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketAction = exports.TicketStatus = void 0;
var TicketStatus;
(function (TicketStatus) {
    TicketStatus["Active"] = "CREATED";
    TicketStatus["CheckedIn"] = "CHECKED-IN";
    TicketStatus["Used"] = "USED";
    TicketStatus["Expired"] = "EXPIRED";
})(TicketStatus || (exports.TicketStatus = TicketStatus = {}));
var TicketAction;
(function (TicketAction) {
    TicketAction["CheckIn"] = "check-in";
    TicketAction["CheckOut"] = "check-out";
})(TicketAction || (exports.TicketAction = TicketAction = {}));
//# sourceMappingURL=constants.js.map