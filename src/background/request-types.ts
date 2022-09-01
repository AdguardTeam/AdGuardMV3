// @ts-expect-error
import { RequestType } from '@adguard/tsurlfilter/dist/es/request-type';

export const RequestTypes = {

    DOCUMENT: 'DOCUMENT',

    SUBDOCUMENT: 'SUBDOCUMENT',

    SCRIPT: 'SCRIPT',
    STYLESHEET: 'STYLESHEET',
    OBJECT: 'OBJECT',
    IMAGE: 'IMAGE',
    XMLHTTPREQUEST: 'XMLHTTPREQUEST',
    MEDIA: 'MEDIA',
    FONT: 'FONT',
    WEBSOCKET: 'WEBSOCKET',
    WEBRTC: 'WEBRTC',
    OTHER: 'OTHER',
    CSP: 'CSP',
    COOKIE: 'COOKIE',
    PING: 'PING',
    CSP_REPORT: 'CSP_REPORT',

    transformRequestType(requestType:string) {
        const contentTypes = RequestTypes;

        switch (requestType) {
            case contentTypes.DOCUMENT:
                return RequestType.Document;
            case contentTypes.SUBDOCUMENT:
                return RequestType.Subdocument;
            case contentTypes.STYLESHEET:
                return RequestType.Stylesheet;
            case contentTypes.FONT:
                return RequestType.Font;
            case contentTypes.IMAGE:
                return RequestType.Image;
            case contentTypes.MEDIA:
                return RequestType.Media;
            case contentTypes.SCRIPT:
                return RequestType.Script;
            case contentTypes.XMLHTTPREQUEST:
                return RequestType.XmlHttpRequest;
            case contentTypes.WEBSOCKET:
                return RequestType.Websocket;
            case contentTypes.WEBRTC:
                return RequestType.Webrtc;
            case contentTypes.PING:
                return RequestType.Ping;
            default:
                return RequestType.Other;
        }
    },

    transformRequestTypeFromTs(requestType:string) {
        const contentTypes = RequestTypes;

        switch (requestType) {
            case RequestType.Document:
                return contentTypes.DOCUMENT;
            case RequestType.Subdocument:
                return contentTypes.SUBDOCUMENT;
            case RequestType.Stylesheet:
                return contentTypes.STYLESHEET;
            case RequestType.Font:
                return contentTypes.FONT;
            case RequestType.Image:
                return contentTypes.IMAGE;
            case RequestType.Media:
                return contentTypes.MEDIA;
            case RequestType.Script:
                return contentTypes.SCRIPT;
            case RequestType.XmlHttpRequest:
                return contentTypes.XMLHTTPREQUEST;
            case RequestType.Websocket:
                return contentTypes.WEBSOCKET;
            case RequestType.Ping:
                return contentTypes.PING;
            default:
                return contentTypes.OTHER;
        }
    },
};
