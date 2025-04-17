/**
 * @swagger
 * components:
 *   schemas:
 *     Monkey:
 *       type: object
 *       properties:
 *         monkeyId:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: George
 *         isActive:
 *           type: boolean
 *           example: true
 *         address:
 *           type: string
 *           example: 192.168.178.42
 *         location:
 *           $ref: '#/components/schemas/Location'
 *
 *     Location:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 2
 *         name:
 *           type: string
 *           example: Main Lobby
 *
 *     NavigationRequest:
 *       type: object
 *       required:
 *         - destinationLocationName
 *       properties:
 *         destinationLocationName:
 *           type: string
 *           example: Optometrist
 *
 *     NavigationResponse:
 *       type: object
 *       properties:
 *         qrCode:
 *           type: string
 *           format: uri
 *           description: Base64-encoded QR code
 *         routeDescription:
 *           type: string
 *           example: Go straight past reception...
 *
 *     QRCodeVerificationRequest:
 *       type: object
 *       required:
 *         - token
 *         - destinationId
 *       properties:
 *         token:
 *           type: string
 *           example: "205299c9467fcd596f3d629f99364602"
 *         destinationId:
 *           type: integer
 *           example: 2
 *
 *     SuccessMessage:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Destination verified successfully.
 *
 *     ErrorMessage:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Something went wrong
 */
