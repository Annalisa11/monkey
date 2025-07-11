/**
 * @swagger
 * components:
 *   schemas:
 *     Monkey:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - isActive
 *         - address
 *         - location
 *       properties:
 *         id:
 *           type: integer
 *           format: int32
 *           minimum: 1
 *           example: 1
 *           description: Unique identifier for the monkey
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           example: George
 *           description: Name of the monkey
 *         isActive:
 *           type: boolean
 *           example: true
 *           description: Whether the monkey is currently active
 *         address:
 *           type: string
 *           format: ipv4
 *           example: 192.168.178.42
 *           description: IP address of the monkey
 *         location:
 *           $ref: '#/components/schemas/Location'
 *
 *     MonkeyForm:
 *       type: object
 *       required:
 *         - name
 *         - isActive
 *         - address
 *         - location
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           example: George
 *           description: Name of the monkey
 *         isActive:
 *           type: boolean
 *           example: true
 *           description: Whether the monkey is currently active
 *         address:
 *           type: string
 *           format: ipv4
 *           example: 192.168.178.42
 *           description: IP address of the monkey
 *         location:
 *           $ref: '#/components/schemas/Location'
 *
 *     Location:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           format: int32
 *           minimum: 1
 *           example: 2
 *           description: Unique identifier for the location
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           example: Main Lobby
 *           description: Name of the location
 *
 *     LocationForm:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           example: Main Lobby
 *           description: Name of the location
 *
 *     Route:
 *       type: object
 *       required:
 *         - sourceLocation
 *         - destinationLocation
 *         - description
 *       properties:
 *         sourceLocation:
 *           $ref: '#/components/schemas/Location'
 *         destinationLocation:
 *           $ref: '#/components/schemas/Location'
 *         description:
 *           type: string
 *           minLength: 10
 *           example: Go past reception and take the elevator to the second floor. Turn left and you'll find the office at the end of the hallway.
 *           description: Detailed description of the route
 *         isAccessible:
 *           type: boolean
 *           nullable: true
 *           example: true
 *           description: Whether the route is wheelchair accessible
 *
 *     RouteForm:
 *       type: object
 *       required:
 *         - sourceLocation
 *         - destinationLocation
 *         - description
 *       properties:
 *         sourceLocation:
 *           $ref: '#/components/schemas/Location'
 *         destinationLocation:
 *           $ref: '#/components/schemas/Location'
 *         description:
 *           type: string
 *           minLength: 10
 *           example: Go past reception and take the elevator to the second floor. Turn left and you'll find the office at the end of the hallway.
 *           description: Detailed description of the route
 *         isAccessible:
 *           type: boolean
 *           nullable: true
 *           example: true
 *           description: Whether the route is wheelchair accessible
 *
 *     StoreButtonPressData:
 *       type: object
 *       required:
 *         - monkeyId
 *         - location
 *       properties:
 *         monkeyId:
 *           type: integer
 *           format: int32
 *           minimum: 1
 *           example: 1
 *           description: ID of the monkey that pressed the button
 *         location:
 *           type: string
 *           minLength: 1
 *           example: Main Lobby
 *           description: Location where the button was pressed
 *
 *     CreateNavigation:
 *       type: object
 *       required:
 *         - destinationLocationId
 *       properties:
 *         destinationLocationId:
 *           type: string
 *           minLength: 1
 *           example: Optometrist
 *           description: Name of the destination location
 *         journeyId:
 *           type: integer
 *           format: int32
 *           example: 12
 *           description: The ID of the journey
 *
 *     NavigationRequest:
 *       type: object
 *       required:
 *         - destinationLocationId
 *       properties:
 *         destinationLocationId:
 *           type: string
 *           example: Optometrist
 *           description: Name of the destination location
 *
 *     NavigationResponse:
 *       type: object
 *       properties:
 *         qrCode:
 *           type: object
 *           description: QR code data used for navigation and journey tracking
 *           properties:
 *             token:
 *               type: string
 *               description: Unique token identifying the QR code
 *             destinationId:
 *               type: integer
 *               description: ID of the destination location
 *             journeyId:
 *               type: integer
 *               description: ID of the associated journey
 *           required:
 *             - token
 *             - destinationId
 *             - journeyId
 *         routeDescription:
 *           type: string
 *           example: Go straight past reception...
 *
 *     VerifyQRCode:
 *       type: object
 *       required:
 *         - token
 *         - destinationId
 *       properties:
 *         token:
 *           type: string
 *           minLength: 32
 *           maxLength: 32
 *           example: "205299c9467fcd596f3d629f99364602"
 *           description: Token to verify
 *         destinationId:
 *           type: integer
 *           format: int32
 *           minimum: 1
 *           example: 2
 *           description: ID of the destination location
 *         journeyId:
 *           type: integer
 *           format: int32
 *           example: 123
 *           description: The ID of the journey to verify
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
 *           description: Token to verify
 *         destinationId:
 *           type: integer
 *           example: 2
 *           description: ID of the destination location
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
