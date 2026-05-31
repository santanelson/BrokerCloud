# Evolution Go - Documentação Completa

_Extraído de https://docs.evolutionfoundation.com.br/llms.txt_


---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Add label to chat

> Add label to chat



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-label.yaml post /label/chat
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Label
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /label/chat:
    post:
      summary: Add label to chat
      description: Add label to chat
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ChatLabel'
        description: Label data
      responses:
        '200':
          description: Label added to chat successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: >-
                    Invalid request data. Label and chat information are
                    required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /label/chat
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /label/chat
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to add label to chat
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /label/chat
                  method: POST
        '404':
          description: Not Found - Chat or label not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Chat or label not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /label/chat
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /label/chat
                  method: POST
components:
  schemas:
    ChatLabel:
      type: object
      properties:
        jid:
          type: string
        labelId:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Add label to message

> Add label to message



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-label.yaml post /label/message
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Label
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /label/message:
    post:
      summary: Add label to message
      description: Add label to message
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/MessageLabel'
        description: Label data
      responses:
        '200':
          description: Label added to message successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: >-
                    Invalid request data. Label and message information are
                    required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /label/message
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /label/message
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to add label to message
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /label/message
                  method: POST
        '404':
          description: Not Found - Message or label not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Message or label not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /label/message
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /label/message
                  method: POST
components:
  schemas:
    MessageLabel:
      type: object
      properties:
        jid:
          type: string
        labelId:
          type: string
        messageId:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Add participant to community

> Add participant to community



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/community.yaml post /community/add
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Community
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /community/add:
    post:
      summary: Add participant to community
      description: Add participant to community
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AddParticipant'
        description: Participant data
      responses:
        '200':
          description: Participant added to community successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                data:
                  failed: null
                  success:
                    - 120360000000000004@g.us
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Participant information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /community/add
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /community/add
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to add participant to community
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /community/add
                  method: POST
        '404':
          description: Not Found - Community or participant not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Community or participant not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /community/add
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /community/add
                  method: POST
components:
  schemas:
    AddParticipant:
      type: object
      properties:
        communityJid:
          type: string
        groupJid:
          items:
            type: string
          type: array
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Archive a chat

> Archive a chat



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-chat.yaml post /chat/archive
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Chat
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /chat/archive:
    post:
      summary: Archive a chat
      description: Archive a chat
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ChatBody'
        description: Chat
      responses:
        '200':
          description: Chat archived successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                data:
                  timestamp: 0001-01-01 00:00:00 +0000 UTC
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Chat information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /chat/archive
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /chat/archive
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to archive chat
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /chat/archive
                  method: POST
        '404':
          description: Not Found - Chat not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Chat not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /chat/archive
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /chat/archive
                  method: POST
components:
  schemas:
    ChatBody:
      type: object
      properties:
        number:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Block a contact

> Block a contact



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/user.yaml post /user/block
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - User
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /user/block:
    post:
      summary: Block a contact
      description: Block a contact
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BlockUser'
        description: Block data
      responses:
        '200':
          description: Contact blocked successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                data:
                  DHash: '1700000000000001'
                  JIDs:
                    - 5511999999999@s.whatsapp.net
                    - 5511888888888@s.whatsapp.net
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Contact information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/block
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/block
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to block contact
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/block
                  method: POST
        '404':
          description: Not Found - Contact not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Contact not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/block
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/block
                  method: POST
components:
  schemas:
    BlockUser:
      type: object
      properties:
        number:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Check a user

> Check a user



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/user.yaml post /user/check
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - User
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /user/check:
    post:
      summary: Check a user
      description: Check a user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CheckUser'
        description: User data
      responses:
        '200':
          description: User checked successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  exists:
                    type: boolean
                  user:
                    type: object
              example:
                data:
                  Users:
                    - Query: +5511999999999@s.whatsapp.net
                      IsInWhatsapp: true
                      JID: 5511999999999@s.whatsapp.net
                      RemoteJID: 5511999999999@s.whatsapp.net
                      LID: 100000000000003@lid
                      VerifiedName: ''
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. User information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/check
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/check
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to check user
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/check
                  method: POST
        '404':
          description: Not Found - User not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: User not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/check
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/check
                  method: POST
components:
  schemas:
    CheckUser:
      type: object
      properties:
        number:
          items:
            type: string
          type: array
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Connect to instance

> Connect to instance with the provided data



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-instance.yaml post /instance/connect
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Instance
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security:
  - ApiKeyAuth: []
paths:
  /instance/connect:
    post:
      summary: Connect to instance
      description: Connect to instance with the provided data
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ConnectInstance'
        description: Instance data
      responses:
        '200':
          description: Instance connected successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                data:
                  eventString: >-
                    MESSAGE,SEND_MESSAGE,READ_RECEIPT,PRESENCE,HISTORY_SYNC,CHAT_PRESENCE,CALL,CONNECTION,LABEL,CONTACT,GROUP,NEWSLETTER,QRCODE
                  jid: ''
                  webhookUrl: https://your-webhook-url.com/webhook
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Instance information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/connect
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/connect
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to connect to instance
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/connect
                  method: POST
        '404':
          description: Not Found - Instance not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Instance not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/connect
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/connect
                  method: POST
components:
  schemas:
    ConnectInstance:
      type: object
      properties:
        immediate:
          type: boolean
        phone:
          type: string
        subscribe:
          items:
            type: string
          type: array
        webhookUrl:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: apikey
      description: API Key for authentication (global or instance-specific)

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Create a new instance

> Creates a new instance with the provided data



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-instance.yaml post /instance/create
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Instance
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security:
  - ApiKeyAuth: []
paths:
  /instance/create:
    post:
      summary: Create a new instance
      description: Creates a new instance with the provided data
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateInstance'
        description: Instance data
      responses:
        '200':
          description: Instance created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                  instance:
                    type: object
              example:
                data:
                  id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
                  name: test
                  token: f0e1d2c3-b4a5-6789-0abc-def123456789
                  webhook: ''
                  rabbitmqEnable: ''
                  websocketEnable: ''
                  natsEnable: ''
                  jid: ''
                  qrcode: ''
                  connected: false
                  expiration: 0
                  disconnect_reason: ''
                  events: ''
                  os_name: Evolution GO
                  proxy: ''
                  client_name: evolution
                  createdAt: '2026-01-15T10:30:00.000000-03:00'
                  alwaysOnline: false
                  rejectCall: false
                  msgRejectCall: ''
                  readMessages: false
                  ignoreGroups: false
                  ignoreStatus: false
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Instance information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/create
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/create
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to create instance
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/create
                  method: POST
        '404':
          description: Not Found - Resource not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Resource not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/create
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/create
                  method: POST
components:
  schemas:
    CreateInstance:
      type: object
      properties:
        name:
          type: string
        proxy:
          $ref: '#/components/schemas/ProxyConfig'
        token:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string
    ProxyConfig:
      type: object
      properties:
        address:
          type: string
        password:
          type: string
        port:
          type: string
        username:
          type: string
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: apikey
      description: API Key for authentication (global or instance-specific)

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Create community

> Create community



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/community.yaml post /community/create
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Community
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /community/create:
    post:
      summary: Create community
      description: Create community
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateCommunity'
        description: Community data
      responses:
        '200':
          description: Community created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                  community:
                    type: object
              example:
                data:
                  JID: 120360000000000003@g.us
                  OwnerJID: 100000000000001@lid
                  OwnerPN: 5511999999999@s.whatsapp.net
                  Name: Community Name
                  NameSetAt: '2026-01-15T10:30:00-03:00'
                  NameSetBy: 100000000000001@lid
                  NameSetByPN: 5511999999999@s.whatsapp.net
                  Topic: ''
                  TopicID: ''
                  TopicSetAt: '0001-01-01T00:00:00Z'
                  TopicSetBy: ''
                  TopicSetByPN: ''
                  TopicDeleted: false
                  IsLocked: false
                  IsAnnounce: false
                  AnnounceVersionID: ''
                  IsEphemeral: false
                  DisappearingTimer: 0
                  IsIncognito: false
                  IsParent: true
                  DefaultMembershipApprovalMode: request_required
                  LinkedParentJID: ''
                  IsDefaultSubGroup: false
                  IsJoinApprovalRequired: false
                  AddressingMode: lid
                  GroupCreated: '2026-01-15T10:30:00-03:00'
                  CreatorCountryCode: ''
                  ParticipantVersionID: ''
                  Participants:
                    - JID: 100000000000001@lid
                      PhoneNumber: 5511999999999@s.whatsapp.net
                      LID: 100000000000001@lid
                      IsAdmin: true
                      IsSuperAdmin: true
                      DisplayName: ''
                      Error: 0
                      AddRequest: null
                  ParticipantCount: 0
                  MemberAddMode: admin_add
                  Suspended: false
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Community name is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /community/create
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /community/create
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to create community
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /community/create
                  method: POST
        '404':
          description: Not Found - Resource not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Resource not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /community/create
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /community/create
                  method: POST
components:
  schemas:
    CreateCommunity:
      type: object
      properties:
        communityName:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Create group

> Create group



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-group.yaml post /group/create
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Group
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /group/create:
    post:
      summary: Create group
      description: Create group
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateGroup'
        description: Group data
      responses:
        '200':
          description: Group created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                  group:
                    type: object
              example:
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Group information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/create
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/create
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to create group
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/create
                  method: POST
        '404':
          description: Not Found - Resource not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Resource not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/create
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/create
                  method: POST
components:
  schemas:
    CreateGroup:
      type: object
      properties:
        groupName:
          type: string
        participants:
          items:
            type: string
          type: array
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Create newsletter

> Create newsletter



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/newsletter.yaml post /newsletter/create
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Newsletter
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /newsletter/create:
    post:
      summary: Create newsletter
      description: Create newsletter
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateNewsletter'
        description: Newsletter data
      responses:
        '200':
          description: Newsletter created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                  newsletter:
                    type: object
              example:
                data:
                  id: 120360000000000001@newsletter
                  state:
                    type: active
                  thread_metadata:
                    creation_time: '1700000000'
                    invite: 0029VaAbBbCcDdEeFfGgHh01
                    name:
                      text: Newsletter Name
                      id: '1700000000000008'
                      update_time: '1700000000000008'
                    description:
                      text: Newsletter description
                      id: '1700000000000008'
                      update_time: '1700000000000008'
                    subscribers_count: '0'
                    verification: unverified
                    picture: null
                    preview:
                      url: ''
                      id: '1700000000829122'
                      type: PREVIEW
                      direct_path: ''
                      hash: null
                    settings:
                      reaction_codes:
                        value: ''
                  viewer_metadata:
                    mute: 'on'
                    role: owner
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Newsletter information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/create
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/create
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to create newsletter
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/create
                  method: POST
        '404':
          description: Not Found - Resource not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Resource not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/create
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/create
                  method: POST
components:
  schemas:
    CreateNewsletter:
      type: object
      properties:
        description:
          type: string
        name:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Delete a message for everyone

> Delete a message for everyone



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-message.yaml post /message/delete
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Message
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /message/delete:
    post:
      summary: Delete a message for everyone
      description: Delete a message for everyone
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Message'
        description: Delete a message for everyone
      responses:
        '200':
          description: Message deleted for everyone successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                data:
                  messageId: 3EB0000000000000000001
                  timestamp: 0001-01-01 00:00:00 +0000 UTC
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Message information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/delete
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/delete
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to delete message
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/delete
                  method: POST
        '404':
          description: Not Found - Message not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Message not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/delete
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/delete
                  method: POST
components:
  schemas:
    Message:
      type: object
      properties:
        chat:
          type: string
        messageId:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Delete instance

> Delete instance



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-instance.yaml delete /instance/delete/{instanceId}
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Instance
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security:
  - ApiKeyAuth: []
paths:
  /instance/delete/{instanceId}:
    delete:
      summary: Delete instance
      description: Delete instance
      operationId: deleteInstanceById
      parameters:
        - description: Instance Id
          in: path
          name: instanceId
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Instance deleted successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Instance ID is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/delete/{instanceId}
                  method: DELETE
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/delete/{instanceId}
                  method: DELETE
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to delete instance
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/delete/{instanceId}
                  method: DELETE
        '404':
          description: Not Found - Instance not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Instance not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/delete/{instanceId}
                  method: DELETE
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/delete/{instanceId}
                  method: DELETE
components:
  schemas:
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: apikey
      description: API Key for authentication (global or instance-specific)

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Delete proxy

> Delete proxy



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-instance.yaml delete /instance/proxy/{instanceId}
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Instance
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security:
  - ApiKeyAuth: []
paths:
  /instance/proxy/{instanceId}:
    delete:
      summary: Delete proxy
      description: Delete proxy
      parameters:
        - description: Instance id
          in: path
          name: instanceId
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Proxy deleted successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Instance ID is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/proxy/{instanceId}
                  method: DELETE
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/proxy/{instanceId}
                  method: DELETE
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to delete proxy
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/proxy/{instanceId}
                  method: DELETE
        '404':
          description: Not Found - Instance or proxy not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Instance or proxy not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/proxy/{instanceId}
                  method: DELETE
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/proxy/{instanceId}
                  method: DELETE
components:
  schemas:
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: apikey
      description: API Key for authentication (global or instance-specific)

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Disconnect from instance

> Disconnect from instance



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-instance.yaml post /instance/disconnect
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Instance
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security:
  - ApiKeyAuth: []
paths:
  /instance/disconnect:
    post:
      summary: Disconnect from instance
      description: Disconnect from instance
      responses:
        '200':
          description: Instance disconnected successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/disconnect
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/disconnect
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to disconnect from instance
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/disconnect
                  method: POST
        '404':
          description: Not Found - Instance not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Instance not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/disconnect
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/disconnect
                  method: POST
components:
  schemas:
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: apikey
      description: API Key for authentication (global or instance-specific)

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Download an image

> Download an image



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-message.yaml post /message/downloadimage
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Message
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /message/downloadimage:
    post:
      summary: Download an image
      description: Download an image
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/DownloadImage'
        description: Download an image
      responses:
        '200':
          description: >
            ⚠️ BUG CONHECIDO: Este endpoint retorna erro 500 com "Failed to
            download image download failed with status code 429" (rate limit).
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  image:
                    type: string
                    format: base64
              example:
                error: Failed to download image download failed with status code 429
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Image information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/downloadimage
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/downloadimage
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to download image
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/downloadimage
                  method: POST
        '404':
          description: Not Found - Image not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Image not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/downloadimage
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/downloadimage
                  method: POST
components:
  schemas:
    DownloadImage:
      type: object
      properties:
        directPath:
          type: string
        fileEncSHA256:
          items:
            type: integer
          type: array
        fileLength:
          type: integer
        fileSHA256:
          items:
            type: integer
          type: array
        mediaKey:
          items:
            type: integer
          type: array
        mimetype:
          type: string
        url:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Edit a message

> Edit a message



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-message.yaml post /message/edit
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Message
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /message/edit:
    post:
      summary: Edit a message
      description: Edit a message
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/EditMessage'
        description: Edit a message
      responses:
        '200':
          description: Message edited successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                data:
                  messageId: 3EB0000000000000000002
                  timestamp: 0001-01-01 00:00:00 +0000 UTC
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Message information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/edit
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/edit
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to edit message
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/edit
                  method: POST
        '404':
          description: Not Found - Message not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Message not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/edit
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/edit
                  method: POST
components:
  schemas:
    EditMessage:
      type: object
      properties:
        chat:
          type: string
        message:
          type: string
        messageId:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Edit label

> Edit label



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-label.yaml post /label/edit
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Label
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /label/edit:
    post:
      summary: Edit label
      description: Edit label
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/EditLabel'
        description: Label data
      responses:
        '200':
          description: Label edited successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                  label:
                    type: object
              example:
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Label information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /label/edit
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /label/edit
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to edit label
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /label/edit
                  method: POST
        '404':
          description: Not Found - Label not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Label not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /label/edit
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /label/edit
                  method: POST
components:
  schemas:
    EditLabel:
      type: object
      properties:
        color:
          type: integer
        deleted:
          type: boolean
        labelId:
          type: string
        name:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Get a user

> Get a user



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/user.yaml post /user/info
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - User
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /user/info:
    post:
      summary: Get a user
      description: Get a user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CheckUser'
        description: User data
      responses:
        '200':
          description: User retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  user:
                    type: object
              example:
                data:
                  Users:
                    5511999999999@s.whatsapp.net:
                      VerifiedName: null
                      Status: ' '
                      PictureID: '123456789'
                      Devices:
                        - 5511999999999@s.whatsapp.net
                      LID: 100000000000004@lid
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. User information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/info
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/info
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to get user
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/info
                  method: POST
        '404':
          description: Not Found - User not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: User not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/info
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/info
                  method: POST
components:
  schemas:
    CheckUser:
      type: object
      properties:
        number:
          items:
            type: string
          type: array
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Get a user's avatar

> Get a user's avatar



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/user.yaml post /user/avatar
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - User
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /user/avatar:
    post:
      summary: Get a user's avatar
      description: Get a user's avatar
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/GetAvatar'
        description: Avatar data
      responses:
        '200':
          description: User avatar retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  avatar:
                    type: string
                    format: base64
              example:
                success: true
                avatar: iVBORw0KGgoAAAANSUhEUgAA...
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. User information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/avatar
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/avatar
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to get user avatar
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/avatar
                  method: POST
        '404':
          description: Not Found - User not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: User not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/avatar
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/avatar
                  method: POST
components:
  schemas:
    GetAvatar:
      type: object
      properties:
        number:
          type: string
        preview:
          type: boolean
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Get a user's block list

> Get a user's block list



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/user.yaml get /user/blocklist
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - User
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /user/blocklist:
    get:
      summary: Get a user's block list
      description: Get a user's block list
      responses:
        '200':
          description: Block list retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  blockList:
                    items:
                      type: string
                    type: array
              example:
                data:
                  DHash: '1700000000000002'
                  JIDs:
                    - 5511999999999@s.whatsapp.net
                    - 5511888888888@s.whatsapp.net
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/blocklist
                  method: GET
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/blocklist
                  method: GET
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to get block list
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/blocklist
                  method: GET
        '404':
          description: Not Found - User not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: User not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/blocklist
                  method: GET
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/blocklist
                  method: GET
components:
  schemas:
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Get a user's contacts

> Get a user's contacts



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/user.yaml get /user/contacts
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - User
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /user/contacts:
    get:
      summary: Get a user's contacts
      description: Get a user's contacts
      responses:
        '200':
          description: User contacts retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  contacts:
                    type: array
                    items:
                      type: object
              example:
                data:
                  - Jid: 5511999999999@s.whatsapp.net
                    Found: true
                    FirstName: ''
                    FullName: ''
                    PushName: Contact Name
                    BusinessName: ''
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/contacts
                  method: GET
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/contacts
                  method: GET
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to get user contacts
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/contacts
                  method: GET
        '404':
          description: Not Found - User not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: User not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/contacts
                  method: GET
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/contacts
                  method: GET
components:
  schemas:
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Get a user's privacy settings

> Get a user's privacy settings



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/user.yaml get /user/privacy
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - User
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /user/privacy:
    get:
      summary: Get a user's privacy settings
      description: Get a user's privacy settings
      responses:
        '200':
          description: Privacy settings retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  privacy:
                    type: object
              example:
                data:
                  GroupAdd: all
                  LastSeen: none
                  Status: all
                  Profile: all
                  ReadReceipts: none
                  CallAdd: all
                  Online: match_last_seen
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/privacy
                  method: GET
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/privacy
                  method: GET
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to get privacy settings
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/privacy
                  method: GET
        '404':
          description: Not Found - User not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: User not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/privacy
                  method: GET
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/privacy
                  method: GET
components:
  schemas:
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Get all instances

> Get all instances



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-instance.yaml get /instance/all
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Instance
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security:
  - ApiKeyAuth: []
paths:
  /instance/all:
    get:
      summary: Get all instances
      description: Get all instances
      responses:
        '200':
          description: All instances retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  instances:
                    type: array
                    items:
                      type: object
              example:
                data:
                  - id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
                    name: test
                    token: f0e1d2c3-b4a5-6789-0abc-def123456789
                    webhook: ''
                    rabbitmqEnable: ''
                    websocketEnable: ''
                    natsEnable: ''
                    jid: ''
                    qrcode: ''
                    connected: false
                    expiration: 0
                    disconnect_reason: ''
                    events: ''
                    os_name: Evolution GO
                    proxy: ''
                    client_name: evolution
                    createdAt: '2026-01-15T10:30:00.000000-03:00'
                    alwaysOnline: false
                    rejectCall: false
                    msgRejectCall: ''
                    readMessages: false
                    ignoreGroups: false
                    ignoreStatus: false
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/all
                  method: GET
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/all
                  method: GET
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to get all instances
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/all
                  method: GET
        '404':
          description: Not Found - Resource not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Resource not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/all
                  method: GET
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/all
                  method: GET
components:
  schemas:
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: apikey
      description: API Key for authentication (global or instance-specific)

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Get group info

> Get group info



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-group.yaml post /group/info
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Group
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /group/info:
    post:
      summary: Get group info
      description: Get group info
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/GetGroupInfo'
        description: Group data
      responses:
        '200':
          description: Group info retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  group:
                    type: object
              example:
                data:
                  JID: 120360000000000001@g.us
                  OwnerJID: 100000000000001@lid
                  OwnerPN: 5511999999999@s.whatsapp.net
                  Name: Group Name
                  NameSetAt: '2026-01-15T10:30:00-03:00'
                  NameSetBy: 100000000000001@lid
                  NameSetByPN: 5511999999999@s.whatsapp.net
                  Topic: ''
                  TopicID: ''
                  TopicSetAt: '0001-01-01T00:00:00Z'
                  TopicSetBy: ''
                  TopicSetByPN: ''
                  TopicDeleted: false
                  IsLocked: false
                  IsAnnounce: false
                  AnnounceVersionID: '1700000000000004'
                  IsEphemeral: false
                  DisappearingTimer: 0
                  IsIncognito: false
                  IsParent: false
                  DefaultMembershipApprovalMode: ''
                  LinkedParentJID: ''
                  IsDefaultSubGroup: false
                  IsJoinApprovalRequired: false
                  AddressingMode: lid
                  GroupCreated: '2026-01-15T10:30:00-03:00'
                  CreatorCountryCode: BR
                  ParticipantVersionID: '1700000000000005'
                  Participants:
                    - JID: 100000000000001@lid
                      PhoneNumber: 5511999999999@s.whatsapp.net
                      LID: 100000000000001@lid
                      IsAdmin: true
                      IsSuperAdmin: true
                      DisplayName: ''
                      Error: 0
                      AddRequest: null
                  ParticipantCount: 1
                  MemberAddMode: all_member_add
                  Suspended: false
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Group information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/info
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/info
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to get group info
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/info
                  method: POST
        '404':
          description: Not Found - Group not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Group not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/info
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/info
                  method: POST
components:
  schemas:
    GetGroupInfo:
      type: object
      properties:
        groupJid:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Get group invite link

> Get group invite link



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-group.yaml post /group/invitelink
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Group
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /group/invitelink:
    post:
      summary: Get group invite link
      description: Get group invite link
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/GetGroupInviteLink'
        description: Group data
      responses:
        '200':
          description: Group invite link retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  inviteLink:
                    type: string
              example:
                data: https://chat.whatsapp.com/AbCdEfGhIjKlMnOpQrStUv
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Group information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/invitelink
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/invitelink
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to get group invite link
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/invitelink
                  method: POST
        '404':
          description: Not Found - Group not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Group not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/invitelink
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/invitelink
                  method: POST
components:
  schemas:
    GetGroupInviteLink:
      type: object
      properties:
        groupJid:
          type: string
        reset:
          type: boolean
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Get instance QR code

> Get instance QR code



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-instance.yaml get /instance/qr
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Instance
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security:
  - ApiKeyAuth: []
paths:
  /instance/qr:
    get:
      summary: Get instance QR code
      description: Get instance QR code
      responses:
        '200':
          description: Instance QR code retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  qrCode:
                    type: string
              example:
                data:
                  Qrcode: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
                  Code: 2@AbCdEfGhIjKlMnOpQrStUvWxYz0123456789...
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/qr
                  method: GET
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/qr
                  method: GET
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to get instance QR code
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/qr
                  method: GET
        '404':
          description: Not Found - Instance not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Instance not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/qr
                  method: GET
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/qr
                  method: GET
components:
  schemas:
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: apikey
      description: API Key for authentication (global or instance-specific)

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Get instance status

> Get instance status



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-instance.yaml get /instance/status
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Instance
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security:
  - ApiKeyAuth: []
paths:
  /instance/status:
    get:
      summary: Get instance status
      description: Get instance status
      responses:
        '200':
          description: Instance status retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  status:
                    type: string
              example:
                data:
                  Connected: true
                  LoggedIn: false
                  Name: ''
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/status
                  method: GET
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/status
                  method: GET
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to get instance status
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/status
                  method: GET
        '404':
          description: Not Found - Instance not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Instance not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/status
                  method: GET
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/status
                  method: GET
components:
  schemas:
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: apikey
      description: API Key for authentication (global or instance-specific)

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Get message status

> Get message status



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-message.yaml post /message/status
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Message
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /message/status:
    post:
      summary: Get message status
      description: Get message status
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/MessageStatus'
        description: Get message status
      responses:
        '200':
          description: Message status retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  status:
                    type: string
              example:
                data:
                  result: null
                  timestamp: 0001-01-01 00:00:00 +0000 UTC
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Message information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/status
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/status
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to get message status
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/status
                  method: POST
        '404':
          description: Not Found - Message not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Message not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/status
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/status
                  method: POST
components:
  schemas:
    MessageStatus:
      type: object
      properties:
        id:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Get my groups

> Get my groups



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-group.yaml get /group/myall
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Group
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /group/myall:
    get:
      summary: Get my groups
      description: Get my groups
      responses:
        '200':
          description: My groups retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  groups:
                    type: array
                    items:
                      type: object
              example:
                data: null
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/myall
                  method: GET
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/myall
                  method: GET
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to get my groups
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/myall
                  method: GET
        '404':
          description: Not Found - Resource not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Resource not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/myall
                  method: GET
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/myall
                  method: GET
components:
  schemas:
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Get newsletter invite

> Get newsletter invite



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/newsletter.yaml post /newsletter/link
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Newsletter
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /newsletter/link:
    post:
      summary: Get newsletter invite
      description: Get newsletter invite
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/GetNewsletterInvite'
        description: Newsletter data
      responses:
        '200':
          description: Newsletter invite retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  inviteLink:
                    type: string
              example:
                data:
                  id: ''
                  state:
                    type: non_existing
                  thread_metadata:
                    creation_time: '0'
                    invite: ''
                    name:
                      text: ''
                      id: ''
                      update_time: '0'
                    description:
                      text: ''
                      id: ''
                      update_time: '0'
                    subscribers_count: '0'
                    verification: ''
                    picture: null
                    preview:
                      url: ''
                      id: ''
                      type: ''
                      direct_path: ''
                      hash: null
                    settings:
                      reaction_codes:
                        value: ''
                  viewer_metadata: null
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Newsletter information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/link
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/link
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to get newsletter invite
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/link
                  method: POST
        '404':
          description: Not Found - Newsletter not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Newsletter not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/link
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/link
                  method: POST
components:
  schemas:
    GetNewsletterInvite:
      type: object
      properties:
        key:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Get newsletter messages

> Get newsletter messages



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/newsletter.yaml post /newsletter/messages
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Newsletter
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /newsletter/messages:
    post:
      summary: Get newsletter messages
      description: Get newsletter messages
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/GetNewsletterMessages'
        description: Newsletter data
      responses:
        '200':
          description: Newsletter messages retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  messages:
                    type: array
                    items:
                      type: object
              example:
                data: []
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Newsletter information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/messages
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/messages
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to get newsletter messages
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/messages
                  method: POST
        '404':
          description: Not Found - Newsletter not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Newsletter not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/messages
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/messages
                  method: POST
components:
  schemas:
    GetNewsletterMessages:
      type: object
      properties:
        before_id:
          type: integer
        count:
          type: integer
        jid:
          $ref: '#/components/schemas/JID'
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string
    JID:
      type: object
      properties:
        device:
          type: integer
        integrator:
          type: integer
        rawAgent:
          type: integer
        server:
          type: string
        user:
          type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Get newsletter

> Get newsletter



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/newsletter.yaml post /newsletter/info
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Newsletter
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /newsletter/info:
    post:
      summary: Get newsletter
      description: Get newsletter
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/GetNewsletter'
        description: Newsletter data
      responses:
        '200':
          description: Newsletter retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  newsletter:
                    type: object
              example:
                data:
                  id: ''
                  state:
                    type: non_existing
                  thread_metadata:
                    creation_time: '0'
                    invite: ''
                    name:
                      text: ''
                      id: ''
                      update_time: '0'
                    description:
                      text: ''
                      id: ''
                      update_time: '0'
                    subscribers_count: '0'
                    verification: ''
                    picture: null
                    preview:
                      url: ''
                      id: ''
                      type: ''
                      direct_path: ''
                      hash: null
                    settings:
                      reaction_codes:
                        value: ''
                  viewer_metadata: null
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Newsletter information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/info
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/info
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to get newsletter
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/info
                  method: POST
        '404':
          description: Not Found - Newsletter not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Newsletter not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/info
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/info
                  method: POST
components:
  schemas:
    GetNewsletter:
      type: object
      properties:
        jid:
          $ref: '#/components/schemas/JID'
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string
    JID:
      type: object
      properties:
        device:
          type: integer
        integrator:
          type: integer
        rawAgent:
          type: integer
        server:
          type: string
        user:
          type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Configuração Inicial

> Como ativar sua licença, fazer login e criar sua primeira instância no Evolution Go

Após a [instalação](/evolution-go/installation), siga este guia para ativar sua licença, acessar o painel de gerenciamento e criar sua primeira instância WhatsApp no Evolution Go.

***

## Passo 1: Ativar a licença Evolution

Antes de usar o Evolution Go, é necessário ativar sua licença. Ao acessar o sistema pela primeira vez, você será redirecionado para a tela de ativação.

<img src="https://mintcdn.com/evoai-683d737d/dazEX4iJEgjDMOO6/evolution-go/images/01-login.png?fit=max&auto=format&n=dazEX4iJEgjDMOO6&q=85&s=46a6a87a90548a43a9c5d9fc00c144b4" alt="Tela de ativação da licença Evolution Go" width="3586" height="1974" data-path="evolution-go/images/01-login.png" />

### Como ativar

1. Acesse a URL do seu Evolution Go no navegador (ex: `http://localhost:8080` ou o domínio do seu servidor)
2. Na tela de ativação, você verá o formulário **"Ative sua licença Evolution"**
3. Preencha os campos:
   * **Nome Completo** — Seu nome completo para registro
   * **Email** — Seu email para receber o Magic Link de ativação
4. Clique em **"Enviar Magic Link"**
5. Verifique sua caixa de entrada e clique no link recebido para ativar

<Tip>
  Você também pode ativar usando uma conta social: **Continuar com Google** ou **Continuar com GitHub**. Isso agiliza o processo e vincula sua licença automaticamente.
</Tip>

<Note>
  A licença é vinculada ao seu email. Guarde esse email, pois será necessário para futuras ativações ou migrações de servidor.
</Note>

***

## Passo 2: Login no painel

Após ativar a licença, você será direcionado para a tela de login do Evolution Go.

<img src="https://mintcdn.com/evoai-683d737d/dazEX4iJEgjDMOO6/evolution-go/images/02-ativar-licenca.png?fit=max&auto=format&n=dazEX4iJEgjDMOO6&q=85&s=d083bcf9d3b9705c0c62c9509d413fb8" alt="Tela de login do Evolution Go" width="3326" height="1844" data-path="evolution-go/images/02-ativar-licenca.png" />

### Como fazer login

1. No campo **"URL da API Evolution GO"**, insira a URL da sua instância:
   * Para instalação local: `http://localhost:8080`
   * Para servidor remoto: `https://seu-dominio.com` (ou o IP do servidor com a porta)
2. No campo **"API Key (GLOBAL\_API\_KEY)"**, insira a chave de API que você configurou no arquivo `.env` durante a instalação

<Warning>
  A API Key é o valor da variável `GLOBAL_API_KEY` configurada no arquivo `.env` do Evolution Go. Se você não alterou, ela é a chave padrão definida no `.env.example` — **nunca use a chave padrão em produção**.
</Warning>

### Onde encontrar a API Key

A API Key está no arquivo `.env` na raiz do seu projeto Evolution Go:

```env theme={null}
# Chave de API global
GLOBAL_API_KEY=sua-chave-segura-aqui
```

Se estiver usando Docker Compose, ela está no `docker-compose.yml`:

```yaml theme={null}
environment:
  GLOBAL_API_KEY: sua-chave-segura-aqui
```

Após preencher os campos, clique em **"Entrar"** para acessar o painel.

***

## Passo 3: Dashboard

Após o login, você será direcionado para o **Dashboard** do Evolution Go.

<img src="https://mintcdn.com/evoai-683d737d/dazEX4iJEgjDMOO6/evolution-go/images/03-dashboard.png?fit=max&auto=format&n=dazEX4iJEgjDMOO6&q=85&s=f86727579010c6cbb0d55d5c17cd8fe9" alt="Dashboard principal do Evolution Go" width="3600" height="1972" data-path="evolution-go/images/03-dashboard.png" />

O painel possui uma barra lateral com duas seções principais:

* **Dashboard** — Visão geral do sistema (métricas e status serão implementados aqui)
* **Instâncias** — Gerenciamento das suas instâncias WhatsApp

No canto superior direito você encontra:

* **Alternador de tema** (claro/escuro)
* **Botão "Sair"** para fazer logout

***

## Passo 4: Criar sua primeira instância

Navegue até a seção **Instâncias** na barra lateral para gerenciar suas conexões WhatsApp.

<img src="https://mintcdn.com/evoai-683d737d/dazEX4iJEgjDMOO6/evolution-go/images/04-instancias-vazia.png?fit=max&auto=format&n=dazEX4iJEgjDMOO6&q=85&s=0e5550bb7d78d4116afe00a92e3bfcb6" alt="Tela de instâncias sem nenhuma instância criada" width="3600" height="1966" data-path="evolution-go/images/04-instancias-vazia.png" />

Na tela de instâncias você verá:

* Um campo de **busca** para filtrar instâncias
* O botão **"+ Nova Instância"** no canto superior direito
* Uma mensagem indicando que nenhuma instância foi encontrada

### Criando a instância

Clique em **"+ Nova Instância"** para abrir o formulário de criação:

<img src="https://mintcdn.com/evoai-683d737d/dazEX4iJEgjDMOO6/evolution-go/images/05-nova-instancia.png?fit=max&auto=format&n=dazEX4iJEgjDMOO6&q=85&s=83cb5759b07c5da59f231f3387d6e5ee" alt="Modal de criação de nova instância WhatsApp" width="1042" height="928" data-path="evolution-go/images/05-nova-instancia.png" />

Preencha os campos:

| Campo                                | Obrigatório | Descrição                                                                                                        |
| ------------------------------------ | :---------: | ---------------------------------------------------------------------------------------------------------------- |
| **Nome da Instância**                |      ✅      | Nome identificador da sua instância. Use apenas letras, números, hífen (`-`) e underscore (`_`)                  |
| **Token (Opcional)**                 |      ❌      | Token personalizado (UUID) para autenticação da instância. Se não informado, será gerado um UUID automaticamente |
| **Configuração de Proxy (Opcional)** |      ❌      | Configurações de proxy para a conexão WhatsApp, caso necessário                                                  |

Clique em **"+ Criar Instância"** para finalizar.

***

## Passo 5: Conectar ao WhatsApp

Após criar a instância, ela aparecerá na lista com o status **"Desconectado"** (em vermelho).

<img src="https://mintcdn.com/evoai-683d737d/dazEX4iJEgjDMOO6/evolution-go/images/06-instancia-criada.png?fit=max&auto=format&n=dazEX4iJEgjDMOO6&q=85&s=d7f80ab01908cdfadcd4073def3c843f" alt="Instância criada com status Desconectado" width="1398" height="938" data-path="evolution-go/images/06-instancia-criada.png" />

Cada instância exibe:

* **Nome** e identificador da instância
* **Status** atual (`close` = desconectado)
* Botões de ação:
  * **Conectar** (ícone de power, verde) — Inicia a conexão com o WhatsApp
  * **Configurações** (ícone de engrenagem) — Abre as configurações da instância
  * **Excluir** (ícone de lixeira, vermelho) — Remove a instância

### Configurar conexão

Clique no botão **"Conectar"** ou no ícone de **engrenagem** para abrir o modal de configuração da conexão:

<img src="https://mintcdn.com/evoai-683d737d/dazEX4iJEgjDMOO6/evolution-go/images/07-configurar-conexao.png?fit=max&auto=format&n=dazEX4iJEgjDMOO6&q=85&s=803d1c2e5574fef8c690f82aec814521" alt="Modal de configuração de conexão e webhook" width="1436" height="1602" data-path="evolution-go/images/07-configurar-conexao.png" />

Neste modal você pode configurar:

#### Webhook URL (opcional)

Insira a URL que receberá os eventos da instância. Exemplo:

```
https://webhook.site/4d438e6a-7203-4102-8dbc-987addc73b53
```

<Tip>
  Use o <a href="https://webhook.site" target="_blank">webhook.site</a> para testes rápidos. Em produção, aponte para o endpoint do seu servidor que processará os eventos.
</Tip>

#### Eventos para Webhook

Selecione quais eventos serão enviados para a URL do webhook:

* **ALL** — Seleciona todos os eventos (recomendado para começar)
* Ou escolha eventos individuais:

| Evento          | Descrição                                           |
| --------------- | --------------------------------------------------- |
| `MESSAGE`       | Mensagens enviadas e recebidas                      |
| `PRESENCE`      | Status de presença (online/offline)                 |
| `CHAT_PRESENCE` | Presença em chats específicos (digitando, gravando) |
| `CONNECTION`    | Mudanças no status da conexão                       |
| `READ_RECEIPT`  | Confirmações de leitura                             |
| `HISTORY_SYNC`  | Sincronização do histórico de mensagens             |
| `CALL`          | Chamadas recebidas                                  |
| `QRCODE`        | Geração de QR Code para pareamento                  |
| `LABEL`         | Eventos de etiquetas                                |
| `CONTACT`       | Eventos de contatos                                 |

#### Telefone para Pairing Code (opcional)

Se preferir conectar via **código de pareamento** ao invés de QR Code, insira o número de telefone no formato:

```
5511999999999
```

(código do país + DDD + número, sem espaços ou caracteres especiais)

#### Configurações Avançadas

Expanda para ver opções adicionais de configuração da instância.

### Finalizar conexão

Após configurar, clique em **"Conectar"** para iniciar a conexão. Dependendo do método escolhido:

* **QR Code**: Um QR Code será exibido na tela. Abra o WhatsApp no seu celular, vá em **Configurações > Dispositivos conectados > Conectar dispositivo** e escaneie o código.
* **Pairing Code**: Um código de 8 dígitos será gerado. No WhatsApp do celular, vá em **Configurações > Dispositivos conectados > Conectar dispositivo > Conectar com número de telefone** e insira o código.

<Note>
  Após a conexão bem-sucedida, o status da instância mudará de **"Desconectado"** para **"Conectado"** (em verde) e os eventos começarão a ser enviados para o webhook configurado.
</Note>

***

## Próximos passos

<CardGroup cols={1}>
  <Card title="Hospedagem HostGator" icon="server" href="/infraestrutura/hostgator-evolution-go">
    Precisa de um servidor? Confira os planos VPS otimizados para Evolution Go
  </Card>
</CardGroup>


---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Evolution Go

> API WhatsApp de alta performance escrita em Go

O **Evolution Go** é uma implementação de alta performance da API WhatsApp, escrita em Go. Construído com a biblioteca padrão do Go e práticas modernas de desenvolvimento, oferece uma solução robusta e eficiente para integração com WhatsApp utilizando a biblioteca <a href="https://github.com/tulir/whatsmeow" target="_blank">whatsmeow</a>.

## Principais recursos

* **Alta Performance** — Construído em Go para máxima performance e uso mínimo de recursos
* **API RESTful** — Endpoints REST bem documentados e fáceis de usar
* **Eventos em tempo real** — Suporte a WebSocket para recebimento de mensagens em tempo real
* **Armazenamento de mensagens** — Integração opcional com PostgreSQL para persistência
* **Suporte a mídia** — Envio e recebimento de imagens, vídeos, áudios e documentos
* **QR Code** — Geração de QR Code para pareamento de dispositivos
* **Docker** — Configuração Docker pronta para uso
* **Documentação Swagger** — Documentação interativa auto-gerada
* **Sistema de eventos** — Suporte a webhooks, AMQP (RabbitMQ), NATS e WebSocket

## Stack tecnológica

| Tecnologia                                                                 | Uso                                |
| -------------------------------------------------------------------------- | ---------------------------------- |
| Go 1.24+                                                                   | Linguagem principal                |
| `net/http` + ServeMux                                                      | Framework HTTP (biblioteca padrão) |
| <a href="https://github.com/tulir/whatsmeow" target="_blank">whatsmeow</a> | Biblioteca WhatsApp Web            |
| PostgreSQL                                                                 | Banco de dados (opcional)          |
| Swagger/OpenAPI                                                            | Documentação da API                |
| Docker                                                                     | Containerização                    |
| RabbitMQ/AMQP                                                              | Fila de mensagens                  |
| MinIO/S3                                                                   | Armazenamento de mídia             |

## Seções

<CardGroup cols={3}>
  <Card title="Instalação" icon="download" href="/evolution-go/installation">
    Guia passo a passo para instalar e configurar o Evolution Go
  </Card>

  <Card title="Primeiros Passos" icon="rocket" href="/evolution-go/getting-started">
    Ative sua licença, faça login e crie sua primeira instância WhatsApp
  </Card>

  <Card title="Webhooks" icon="webhook" href="/evolution-go/webhooks">
    Configure webhooks para receber eventos em tempo real do WhatsApp
  </Card>

  <Card title="Referência API" icon="square-terminal" href="/evolution-go/get-all-instances">
    Documentação técnica completa de todos os endpoints
  </Card>
</CardGroup>


---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Instalação do Evolution Go

> Guia passo a passo para instalar e configurar o Evolution Go

Este guia irá ajudá-lo a instalar e configurar o **Evolution Go**, nossa API WhatsApp de alta performance escrita em Go.

## Pré-requisitos

Antes de iniciar, certifique-se de ter os seguintes requisitos atendidos:

* <a href="https://docs.docker.com/get-docker/" target="_blank">Docker</a> 20.10 ou superior
* <a href="https://docs.docker.com/compose/install/" target="_blank">Docker Compose</a> v2.x (opcional)
* Mínimo de **512MB de RAM** disponível

***

## Instalação com Docker

A forma mais rápida de começar a usar o Evolution Go.

### Passo 1: Clone o repositório

```bash theme={null}
git clone https://git.evoai.app/Evolution/evolution-go.git
cd evolution-go
```

### Passo 2: Configure as variáveis de ambiente

```bash theme={null}
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env theme={null}
# Porta do servidor
SERVER_PORT=8080

# Nome do cliente
CLIENT_NAME=evolution

# Chave de API global (altere para uma chave segura!)
GLOBAL_API_KEY=sua-chave-secura-aqui

# Banco de dados (PostgreSQL)
POSTGRES_AUTH_DB=postgresql://postgres:password@postgres:5432/evogo_auth?sslmode=disable
POSTGRES_USERS_DB=postgresql://postgres:password@postgres:5432/evogo_users?sslmode=disable
DATABASE_SAVE_MESSAGES=false

# Logs
WADEBUG=INFO
LOGTYPE=console
```

<Warning>
  Nunca utilize a chave de API padrão do `.env.example` em produção. Gere uma chave segura e única.
</Warning>

### Passo 3: Build e execução

```bash theme={null}
# Build da imagem Docker
make docker-build

# Executar o container
make docker-run
```

O serviço estará disponível em `http://localhost:8080`.

### Alternativa: Docker Compose

Você também pode usar um `docker-compose.yml` para subir o Evolution Go junto com o PostgreSQL:

```yaml theme={null}
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  evolution-go:
    image: evoapicloud/evolution-go:latest
    ports:
      - "8080:8080"
    environment:
      SERVER_PORT: 8080
      CLIENT_NAME: evolution
      GLOBAL_API_KEY: sua-chave-segura-aqui
      POSTGRES_AUTH_DB: postgresql://postgres:password@postgres:5432/evogo_auth?sslmode=disable
      POSTGRES_USERS_DB: postgresql://postgres:password@postgres:5432/evogo_users?sslmode=disable
      DATABASE_SAVE_MESSAGES: "false"
      WADEBUG: INFO
      LOGTYPE: console
    depends_on:
      - postgres
    restart: unless-stopped

volumes:
  postgres_data:
```

Execute com:

```bash theme={null}
docker compose up -d
```

***

## Verificando a instalação

Após iniciar o serviço, verifique se está funcionando corretamente:

### Teste de saúde

```bash theme={null}
curl http://localhost:8080/
```

### Acesse a documentação Swagger

Abra no navegador:

```
http://localhost:8080/swagger/index.html
```

### Crie sua primeira instância WhatsApp

```bash theme={null}
curl -X POST http://localhost:8080/instance/create \
  -H "Content-Type: application/json" \
  -H "apikey: sua-chave-segura-aqui" \
  -d '{
    "instanceName": "minha-instancia",
    "integration": "WHATSAPP-BAILEYS"
  }'
```

### Obtenha o QR Code para conectar

```bash theme={null}
curl http://localhost:8080/instance/minha-instancia/qrcode \
  -H "apikey: sua-chave-segura-aqui"
```

Escaneie o QR Code com o WhatsApp do seu celular para conectar a instância.

***

## Variáveis de ambiente

Tabela completa das variáveis de configuração disponíveis:

| Variável                 | Descrição                                                   | Padrão            |
| ------------------------ | ----------------------------------------------------------- | ----------------- |
| `SERVER_PORT`            | Porta do servidor HTTP                                      | `8080`            |
| `CLIENT_NAME`            | Identificador do cliente                                    | `evolution`       |
| `GLOBAL_API_KEY`         | Chave de autenticação da API                                | **Obrigatório**   |
| `POSTGRES_AUTH_DB`       | String de conexão do banco de autenticação                  | -                 |
| `POSTGRES_USERS_DB`      | String de conexão do banco de usuários                      | -                 |
| `DATABASE_SAVE_MESSAGES` | Habilitar persistência de mensagens                         | `false`           |
| `WADEBUG`                | Nível de log do WhatsApp (`DEBUG`, `INFO`, `WARN`, `ERROR`) | `INFO`            |
| `LOGTYPE`                | Tipo de saída de log (`console`, `json`)                    | `console`         |
| `CONNECT_ON_STARTUP`     | Reconectar instâncias ao iniciar                            | `true`            |
| `WEBHOOKFILES`           | Incluir arquivos nos webhooks                               | `true`            |
| `WEBHOOK_URL`            | URL para receber webhooks                                   | -                 |
| `AMQP_URL`               | URL de conexão do RabbitMQ                                  | -                 |
| `AMQP_GLOBAL_ENABLED`    | Habilitar RabbitMQ globalmente                              | `false`           |
| `MINIO_ENABLED`          | Habilitar armazenamento MinIO/S3                            | `false`           |
| `MINIO_ENDPOINT`         | Endpoint do MinIO                                           | -                 |
| `MINIO_ACCESS_KEY`       | Chave de acesso do MinIO                                    | -                 |
| `MINIO_SECRET_KEY`       | Chave secreta do MinIO                                      | -                 |
| `MINIO_BUCKET`           | Nome do bucket do MinIO                                     | `evolution-media` |
| `MINIO_USE_SSL`          | Usar SSL na conexão MinIO                                   | `false`           |

***

## Comandos úteis (Docker)

```bash theme={null}
# Build da imagem Docker
make docker-build

# Executar container Docker
make docker-run
```

***

## Próximos passos

Após a instalação, você pode:

* Consultar a [Referência API](/evolution-go/get-all-instances) para conhecer todos os endpoints disponíveis
* Configurar [webhooks](/evolution-go/getting-started) para receber notificações em tempo real
* Integrar com [RabbitMQ](/evolution-go/getting-started) para processamento assíncrono de mensagens


---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Join group link

> Join group link



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-group.yaml post /group/join
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Group
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /group/join:
    post:
      summary: Join group link
      description: Join group link
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/JoinGroup'
        description: Group data
      responses:
        '200':
          description: Joined group successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Group invite link is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/join
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/join
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to join group
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/join
                  method: POST
        '404':
          description: Not Found - Group or invite link not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Group or invite link not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/join
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/join
                  method: POST
components:
  schemas:
    JoinGroup:
      type: object
      properties:
        code:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# List groups

> List groups



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-group.yaml get /group/list
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Group
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /group/list:
    get:
      summary: List groups
      description: List groups
      responses:
        '200':
          description: Groups listed successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  groups:
                    type: array
                    items:
                      type: object
              example:
                data:
                  - JID: 120360000000000002@g.us
                    OwnerJID: 100000000000002@lid
                    OwnerPN: 5511999999999@s.whatsapp.net
                    Name: Group Name
                    NameSetAt: '2026-01-15T10:30:00-03:00'
                    NameSetBy: 100000000000002@lid
                    NameSetByPN: 5511999999999@s.whatsapp.net
                    Topic: ''
                    TopicID: ''
                    TopicSetAt: '0001-01-01T00:00:00Z'
                    TopicSetBy: ''
                    TopicSetByPN: ''
                    TopicDeleted: false
                    IsLocked: false
                    IsAnnounce: false
                    AnnounceVersionID: '1700000000000006'
                    IsEphemeral: false
                    DisappearingTimer: 0
                    IsIncognito: false
                    IsParent: false
                    DefaultMembershipApprovalMode: ''
                    LinkedParentJID: ''
                    IsDefaultSubGroup: false
                    IsJoinApprovalRequired: false
                    AddressingMode: lid
                    GroupCreated: '2026-01-15T10:30:00-03:00'
                    CreatorCountryCode: BR
                    ParticipantVersionID: '1700000000000007'
                    Participants:
                      - JID: 100000000000002@lid
                        PhoneNumber: 5511999999999@s.whatsapp.net
                        LID: 100000000000002@lid
                        IsAdmin: true
                        IsSuperAdmin: true
                        DisplayName: ''
                        Error: 0
                        AddRequest: null
                    ParticipantCount: 0
                    MemberAddMode: admin_add
                    Suspended: false
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/list
                  method: GET
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/list
                  method: GET
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to list groups
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/list
                  method: GET
        '404':
          description: Not Found - Resource not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Resource not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/list
                  method: GET
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/list
                  method: GET
components:
  schemas:
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# List newsletters

> List newsletters



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/newsletter.yaml get /newsletter/list
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Newsletter
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /newsletter/list:
    get:
      summary: List newsletters
      description: List newsletters
      responses:
        '200':
          description: Newsletters listed successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  newsletters:
                    type: array
                    items:
                      type: object
              example:
                data:
                  - id: 120360000000000001@newsletter
                    state:
                      type: active
                    thread_metadata:
                      creation_time: '1700000000'
                      invite: 0029VaAbBbCcDdEeFfGgHh01
                      name:
                        text: Newsletter Name
                        id: '1700000000000008'
                        update_time: '1700000000000008'
                      description:
                        text: Newsletter description
                        id: '1700000000000008'
                        update_time: '1700000000000008'
                      subscribers_count: '0'
                      verification: unverified
                      picture: null
                      preview:
                        url: ''
                        id: '1700000000000009'
                        type: PREVIEW
                        direct_path: ''
                        hash: null
                      settings:
                        reaction_codes:
                          value: ALL
                    viewer_metadata:
                      mute: 'on'
                      role: owner
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/list
                  method: GET
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/list
                  method: GET
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to list newsletters
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/list
                  method: GET
        '404':
          description: Not Found - Resource not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Resource not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/list
                  method: GET
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/list
                  method: GET
components:
  schemas:
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Logout from instance

> Logout from instance



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-instance.yaml delete /instance/logout
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Instance
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security:
  - ApiKeyAuth: []
paths:
  /instance/logout:
    delete:
      summary: Logout from instance
      description: Logout from instance
      responses:
        '200':
          description: Instance logged out successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/logout
                  method: DELETE
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/logout
                  method: DELETE
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to logout from instance
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/logout
                  method: DELETE
        '404':
          description: Not Found - Instance not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Instance not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/logout
                  method: DELETE
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/logout
                  method: DELETE
components:
  schemas:
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: apikey
      description: API Key for authentication (global or instance-specific)

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Mark a message as read

> Mark a message as read



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-message.yaml post /message/markread
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Message
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /message/markread:
    post:
      summary: Mark a message as read
      description: Mark a message as read
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/MarkRead'
        description: Mark a message as read
      responses:
        '200':
          description: Message marked as read successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                data:
                  timestamp: 0001-01-01 00:00:00 +0000 UTC
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Message information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/markread
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/markread
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to mark message as read
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/markread
                  method: POST
        '404':
          description: Not Found - Message not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Message not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/markread
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/markread
                  method: POST
components:
  schemas:
    MarkRead:
      type: object
      properties:
        id:
          items:
            type: string
          type: array
        number:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Mute a chat

> Mute a chat



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-chat.yaml post /chat/mute
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Chat
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /chat/mute:
    post:
      summary: Mute a chat
      description: Mute a chat
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ChatBody'
        description: Chat
      responses:
        '200':
          description: Chat muted successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                data:
                  timestamp: 0001-01-01 00:00:00 +0000 UTC
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Chat information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /chat/mute
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /chat/mute
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to mute chat
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /chat/mute
                  method: POST
        '404':
          description: Not Found - Chat not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Chat not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /chat/mute
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /chat/mute
                  method: POST
components:
  schemas:
    ChatBody:
      type: object
      properties:
        number:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Community Node N8N

> Como instalar o node comunitário do Evolution Go no N8N

Integre o **Evolution Go** diretamente nos seus fluxos do N8N utilizando o node comunitário oficial.

## Pré-requisitos

* Instância do **N8N** em funcionamento
* **Evolution Go** instalado e acessível

***

## Instalação

<Steps>
  <Step title="Acessar configurações">
    No N8N, navegue até **Settings > Community Nodes** (`/settings/community-nodes`)
  </Step>

  <Step title="Iniciar instalação">
    Clique em **Install**
  </Step>

  <Step title="Informar o pacote">
    No campo de instalação, digite:

    ```
    n8n-nodes-evolution-go
    ```
  </Step>

  <Step title="Aceitar termos e instalar">
    Aceite o termo de uso e clique em **Install**
  </Step>
</Steps>

## Usando o node

Após o processo de instalação, o node estará disponível nos seus fluxos. Para localizá-lo, pesquise por **"Evolution GO"** na barra de busca de nodes do N8N.


---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Pin a chat

> Pin a chat



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-chat.yaml post /chat/pin
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Chat
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /chat/pin:
    post:
      summary: Pin a chat
      description: Pin a chat
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ChatBody'
        description: Chat
      responses:
        '200':
          description: Chat pinned successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                data:
                  timestamp: 0001-01-01 00:00:00 +0000 UTC
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Chat information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /chat/pin
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /chat/pin
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to pin chat
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /chat/pin
                  method: POST
        '404':
          description: Not Found - Chat not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Chat not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /chat/pin
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /chat/pin
                  method: POST
components:
  schemas:
    ChatBody:
      type: object
      properties:
        number:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Usando com Postman

> Como importar a collection oficial e testar a API do Evolution Go usando o Postman

O **Postman** é uma ferramenta para testar e explorar APIs REST de forma visual e intuitiva. Com a collection oficial do Evolution Go, você pode executar requisições, configurar ambientes e explorar todos os endpoints sem precisar escrever código.

## Pré-requisitos

* **Evolution Go** instalado e rodando — veja o [guia de instalação](/evolution-go/installation)
* **Postman** instalado — <a href="https://www.postman.com/downloads/" target="_blank">baixe aqui</a>
* Sua **API Key** (`GLOBAL_API_KEY` configurada no `.env`)

***

## Passo 1: Importar a Collection Oficial

A collection oficial do Evolution Go está disponível publicamente no Postman e contém todos os endpoints da API prontos para uso.

<Steps>
  <Step title="Abrir o Postman">
    Abra o Postman no seu computador ou acesse o <a href="https://web.postman.com" target="_blank">Postman Web</a>.
  </Step>

  <Step title="Acessar Import">
    No canto superior esquerdo, clique em **Import**.
  </Step>

  <Step title="Importar via link">
    Selecione a aba **Link** e cole a URL da collection oficial:

    ```
    https://www.postman.com/agenciadgcode/evolution-api/collection/u95jxho/evolution-go
    ```
  </Step>

  <Step title="Confirmar importação">
    Clique em **Continue** e depois em **Import**. A collection **Evolution Go** aparecerá na sua barra lateral.
  </Step>
</Steps>

***

## Passo 2: Criar o Environment

As variáveis de ambiente centralizam as configurações da sua instância, permitindo trocar entre ambientes (local, staging, produção) sem alterar cada requisição.

<Steps>
  <Step title="Criar novo Environment">
    No Postman, clique em **Environments** (ícone de olho no canto superior direito) e depois em **+** para criar um novo.
  </Step>

  <Step title="Nomear o Environment">
    Dê o nome **Evolution Go** (ou outro nome de sua preferência).
  </Step>

  <Step title="Adicionar as variáveis">
    Adicione as seguintes variáveis:

    | Variável      | Valor inicial                      | Descrição                             |
    | ------------- | ---------------------------------- | ------------------------------------- |
    | `base_url`    | `http://localhost:8080`            | URL base do seu servidor Evolution Go |
    | `api_key`     | `sua-chave-aqui`                   | Valor do `GLOBAL_API_KEY` no `.env`   |
    | `instance_id` | *(preencher após criar instância)* | UUID da instância WhatsApp            |
  </Step>

  <Step title="Salvar e ativar">
    Clique em **Save** e selecione o environment **Evolution Go** no seletor no canto superior direito do Postman.
  </Step>
</Steps>

<Warning>
  Nunca compartilhe ou exponha o valor da `api_key` publicamente. Ela dá acesso total à sua API.
</Warning>

***

## Passo 3: Configurar os Headers da Collection

Para não precisar adicionar os headers em cada requisição individualmente, configure-os no nível da collection.

<Steps>
  <Step title="Abrir configurações da collection">
    Clique com o botão direito em **Evolution Go** na sidebar e selecione **Edit**.
  </Step>

  <Step title="Acessar a aba Variables">
    Confirme que as variáveis `base_url`, `api_key` e `instance_id` estão referenciadas.
  </Step>

  <Step title="Configurar Pre-request Script (opcional)">
    Se preferir, adicione os headers padrão em todas as requisições via **Pre-request Script**:

    ```javascript theme={null}
    pm.request.headers.add({ key: "apikey", value: pm.environment.get("api_key") });
    pm.request.headers.add({ key: "instanceId", value: pm.environment.get("instance_id") });
    pm.request.headers.add({ key: "Content-Type", value: "application/json" });
    ```
  </Step>
</Steps>

<Note>
  Os headers necessários para autenticação são:

  * `apikey`: sua `GLOBAL_API_KEY`
  * `instanceId`: UUID da instância (necessário nas rotas que operam sobre uma instância específica)
  * `Content-Type`: `application/json` (para requisições com body)
</Note>

***

## Passo 4: Testar a Conexão

Antes de criar instâncias, verifique se o Evolution Go está acessível.

**Requisição:**

```
GET {{base_url}}/
```

Uma resposta de sucesso indica que o servidor está no ar. Se retornar erro de conexão, verifique se o Evolution Go está rodando e se o `base_url` está correto.

***

## Passo 5: Criar uma Instância WhatsApp

Com a conexão verificada, crie sua primeira instância.

**Requisição:**

```
POST {{base_url}}/instance/create
```

**Headers:**

| Key            | Value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |
| `apikey`       | `{{api_key}}`      |

**Body:**

```json theme={null}
{
  "instanceName": "minha-instancia",
  "integration": "WHATSAPP-BAILEYS"
}
```

**Resposta de sucesso:**

```json theme={null}
{
  "instanceName": "minha-instancia",
  "instanceId": "249aad2e-68f9-464f-bc84-aca560c38f0e",
  "token": "seu-token-aqui",
  "status": "created"
}
```

<Tip>
  Copie o `instanceId` da resposta e salve na variável `instance_id` do seu Environment para usar nas próximas requisições.
</Tip>

***

## Passo 6: Conectar ao WhatsApp

Com a instância criada, inicie a conexão com o WhatsApp. Este endpoint também permite configurar o webhook para receber eventos.

**Requisição:**

```
POST {{base_url}}/instance/connect
```

**Headers:**

| Key            | Value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |
| `apikey`       | `{{api_key}}`      |
| `instanceId`   | `{{instance_id}}`  |

**Body:**

```json theme={null}
{
  "webhookUrl": "https://webhook.site/seu-id-unico",
  "subscribe": ["ALL"],
  "immediate": true
}
```

Após a requisição, você receberá um QR Code via webhook (campo `qrcode` em base64). Escaneie-o com o WhatsApp do seu celular em **Configurações > Dispositivos conectados > Conectar dispositivo**.

<Note>
  Para conectar via **Pairing Code** ao invés de QR Code, adicione o campo `phone` no body com o número no formato `5511999999999`.
</Note>

***

## Explorando Mais Endpoints

<Tip>
  Acesse a documentação interativa **Swagger** da sua instância para descobrir todos os endpoints disponíveis:

  ```
  {{base_url}}/swagger/index.html
  ```

  O Swagger permite visualizar parâmetros, testar endpoints diretamente no navegador e ver exemplos de response.
</Tip>

***

## Próximos passos

<CardGroup cols={2}>
  <Card title="Configurar Webhooks" icon="webhook" href="/evolution-go/webhooks">
    Receba eventos em tempo real de mensagens, conexões e muito mais
  </Card>

  <Card title="Configuração Inicial" icon="rocket" href="/evolution-go/getting-started">
    Gerencie instâncias pelo painel visual do Evolution Go
  </Card>
</CardGroup>


---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# React a message

> React a message



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-message.yaml post /message/react
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Message
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /message/react:
    post:
      summary: React a message
      description: React a message
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/React'
        description: React a message
      responses:
        '200':
          description: Message reacted successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                data:
                  Info:
                    Chat: 5511999999999@s.whatsapp.net
                    Sender: 5511888888888:24@s.whatsapp.net
                    IsFromMe: true
                    IsGroup: false
                    AddressingMode: ''
                    SenderAlt: ''
                    RecipientAlt: ''
                    BroadcastListOwner: ''
                    BroadcastRecipients: null
                    ID: 3EB0000000000000000003
                    ServerID: 0
                    Type: ReactionMessage
                    PushName: ''
                    Timestamp: '2026-01-15T10:30:00.000000-03:00'
                    Category: ''
                    Multicast: false
                    MediaType: ''
                    Edit: ''
                    MsgBotInfo:
                      EditType: ''
                      EditTargetID: ''
                      EditSenderTimestampMS: '0001-01-01T00:00:00Z'
                    MsgMetaInfo:
                      TargetID: ''
                      TargetSender: ''
                      TargetChat: ''
                      DeprecatedLIDSession: null
                      ThreadMessageID: ''
                      ThreadMessageSenderJID: ''
                    VerifiedName: null
                    DeviceSentMeta: null
                  Message:
                    reactionMessage:
                      key:
                        remoteJID: 5511999999999@s.whatsapp.net
                        fromMe: false
                        ID: 3EB0000000000000000003
                      text: 🔥
                      senderTimestampMS: 1700000000000
                  MessageContextInfo: null
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: >-
                    Invalid request data. Message and reaction information are
                    required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/react
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/react
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to react to message
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/react
                  method: POST
        '404':
          description: Not Found - Message not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Message not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/react
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/react
                  method: POST
components:
  schemas:
    React:
      type: object
      properties:
        id:
          type: string
        number:
          type: string
        reaction:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Remove label from chat

> Remove label from chat



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-label.yaml post /unlabel/chat
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Label
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /unlabel/chat:
    post:
      summary: Remove label from chat
      description: Remove label from chat
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ChatLabel'
        description: Label data
      responses:
        '200':
          description: Label removed from chat successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: >-
                    Invalid request data. Label and chat information are
                    required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /unlabel/chat
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /unlabel/chat
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to remove label from chat
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /unlabel/chat
                  method: POST
        '404':
          description: Not Found - Chat or label not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Chat or label not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /unlabel/chat
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /unlabel/chat
                  method: POST
components:
  schemas:
    ChatLabel:
      type: object
      properties:
        jid:
          type: string
        labelId:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Remove label from message

> Remove label from message



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-label.yaml post /unlabel/message
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Label
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /unlabel/message:
    post:
      summary: Remove label from message
      description: Remove label from message
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/MessageLabel'
        description: Label data
      responses:
        '200':
          description: Label removed from message successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: >-
                    Invalid request data. Label and message information are
                    required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /unlabel/message
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /unlabel/message
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to remove label from message
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /unlabel/message
                  method: POST
        '404':
          description: Not Found - Message or label not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Message or label not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /unlabel/message
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /unlabel/message
                  method: POST
components:
  schemas:
    MessageLabel:
      type: object
      properties:
        jid:
          type: string
        labelId:
          type: string
        messageId:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Remove participant from community

> Remove participant from community



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/community.yaml post /community/remove
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Community
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /community/remove:
    post:
      summary: Remove participant from community
      description: Remove participant from community
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AddParticipant'
        description: Participant data
      responses:
        '200':
          description: Participant removed from community successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                data:
                  failed: null
                  success:
                    - 120360000000000004@g.us
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Participant information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /community/remove
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /community/remove
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: >-
                    Insufficient permissions to remove participant from
                    community
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /community/remove
                  method: POST
        '404':
          description: Not Found - Community or participant not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Community or participant not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /community/remove
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /community/remove
                  method: POST
components:
  schemas:
    AddParticipant:
      type: object
      properties:
        communityJid:
          type: string
        groupJid:
          items:
            type: string
          type: array
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Request pairing code

> Request pairing code



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-instance.yaml post /instance/pair
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Instance
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security:
  - ApiKeyAuth: []
paths:
  /instance/pair:
    post:
      summary: Request pairing code
      description: Request pairing code
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PairInstance'
        description: Instance data
      responses:
        '200':
          description: Pairing code retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  pairingCode:
                    type: string
              example:
                data:
                  PairingCode: ''
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Instance information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/pair
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/pair
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to request pairing code
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/pair
                  method: POST
        '404':
          description: Not Found - Instance not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Instance not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/pair
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /instance/pair
                  method: POST
components:
  schemas:
    PairInstance:
      type: object
      properties:
        phone:
          type: string
        subscribe:
          items:
            type: string
          type: array
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: apikey
      description: API Key for authentication (global or instance-specific)

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Send a contact message

> Send a contact message



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/send-message.yaml post /send/contact
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Send Message
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /send/contact:
    post:
      summary: Send a contact message
      description: Send a contact message
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SendContact'
        description: Message data
      responses:
        '200':
          description: Contact message sent successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                  messageId:
                    type: string
              example:
                data:
                  Info:
                    Chat: 5511999999999@s.whatsapp.net
                    Sender: 5511888888888:24@s.whatsapp.net
                    IsFromMe: true
                    IsGroup: false
                    AddressingMode: ''
                    SenderAlt: ''
                    RecipientAlt: ''
                    BroadcastListOwner: ''
                    BroadcastRecipients: null
                    ID: 3EB0000000000000000004
                    ServerID: 0
                    Type: ContactMessage
                    PushName: ''
                    Timestamp: '2026-01-15T10:30:00.000000-03:00'
                    Category: ''
                    Multicast: false
                    MediaType: ''
                    Edit: ''
                    MsgBotInfo:
                      EditType: ''
                      EditTargetID: ''
                      EditSenderTimestampMS: '0001-01-01T00:00:00Z'
                    MsgMetaInfo:
                      TargetID: ''
                      TargetSender: ''
                      TargetChat: ''
                      DeprecatedLIDSession: null
                      ThreadMessageID: ''
                      ThreadMessageSenderJID: ''
                    VerifiedName: null
                    DeviceSentMeta: null
                  Message:
                    contactMessage:
                      displayName: Contact Name
                      vcard: >-

                        BEGIN:VCARD

                        VERSION:3.0

                        FN:Contact Name

                        ORG:Company;

                        TEL;type=CELL;type=VOICE;waid=5511999999999:5511999999999

                        END:VCARD
                      contextInfo: {}
                  MessageContextInfo:
                    stanzaID: ''
                    participant: ''
                    quotedMessage:
                      conversation: ''
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: >-
                    Invalid request data. Contact and recipient information are
                    required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/contact
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/contact
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to send contact message
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/contact
                  method: POST
        '404':
          description: Not Found - Recipient or contact not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Recipient or contact not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/contact
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/contact
                  method: POST
components:
  schemas:
    SendContact:
      type: object
      properties:
        delay:
          type: integer
        id:
          type: string
        mentionAll:
          type: boolean
        mentionedJid:
          type: string
        number:
          type: string
        quoted:
          $ref: '#/components/schemas/QuotedMessage'
        vcard:
          $ref: '#/components/schemas/VCard'
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string
    QuotedMessage:
      type: object
      properties:
        messageId:
          type: string
        participant:
          type: string
    VCard:
      type: object
      properties:
        fullName:
          type: string
        organization:
          type: string
        phone:
          type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Send a link message

> Send a link message



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/send-message.yaml post /send/link
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Send Message
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /send/link:
    post:
      summary: Send a link message
      description: Send a link message
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SendLink'
        description: Message data
      responses:
        '200':
          description: Link message sent successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                  messageId:
                    type: string
              example:
                data:
                  Info:
                    Chat: 5511999999999@s.whatsapp.net
                    Sender: 5511888888888:24@s.whatsapp.net
                    IsFromMe: true
                    IsGroup: false
                    AddressingMode: ''
                    SenderAlt: ''
                    RecipientAlt: ''
                    BroadcastListOwner: ''
                    BroadcastRecipients: null
                    ID: 3EB0000000000000000005
                    ServerID: 0
                    Type: ExtendedTextMessage
                    PushName: ''
                    Timestamp: '2026-01-15T10:30:00.000000-03:00'
                    Category: ''
                    Multicast: false
                    MediaType: ''
                    Edit: ''
                    MsgBotInfo:
                      EditType: ''
                      EditTargetID: ''
                      EditSenderTimestampMS: '0001-01-01T00:00:00Z'
                    MsgMetaInfo:
                      TargetID: ''
                      TargetSender: ''
                      TargetChat: ''
                      DeprecatedLIDSession: null
                      ThreadMessageID: ''
                      ThreadMessageSenderJID: ''
                    VerifiedName: null
                    DeviceSentMeta: null
                  Message:
                    extendedTextMessage:
                      text: message text https://example.com
                      matchedText: https://example.com
                      description: Page description
                      title: Page Title
                      JPEGThumbnail: '#'
                      contextInfo: {}
                  MessageContextInfo:
                    stanzaID: ''
                    participant: ''
                    quotedMessage:
                      conversation: ''
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: >-
                    Invalid request data. Link and recipient information are
                    required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/link
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/link
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to send link message
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/link
                  method: POST
        '404':
          description: Not Found - Recipient not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Recipient not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/link
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/link
                  method: POST
components:
  schemas:
    SendLink:
      type: object
      properties:
        delay:
          type: integer
        description:
          type: string
        id:
          type: string
        imgUrl:
          type: string
        mentionAll:
          type: boolean
        mentionedJid:
          type: string
        number:
          type: string
        quoted:
          $ref: '#/components/schemas/QuotedMessage'
        text:
          type: string
        title:
          type: string
        url:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string
    QuotedMessage:
      type: object
      properties:
        messageId:
          type: string
        participant:
          type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Send a location message

> Send a location message



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/send-message.yaml post /send/location
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Send Message
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /send/location:
    post:
      summary: Send a location message
      description: Send a location message
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SendLocation'
        description: Message data
      responses:
        '200':
          description: Location message sent successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                  messageId:
                    type: string
              example:
                data:
                  Info:
                    Chat: 5511999999999@s.whatsapp.net
                    Sender: 5511888888888:24@s.whatsapp.net
                    IsFromMe: true
                    IsGroup: false
                    AddressingMode: ''
                    SenderAlt: ''
                    RecipientAlt: ''
                    BroadcastListOwner: ''
                    BroadcastRecipients: null
                    ID: 3EB0000000000000000006
                    ServerID: 0
                    Type: LocationMessage
                    PushName: ''
                    Timestamp: '2026-01-15T10:30:00.000000-03:00'
                    Category: ''
                    Multicast: false
                    MediaType: ''
                    Edit: ''
                    MsgBotInfo:
                      EditType: ''
                      EditTargetID: ''
                      EditSenderTimestampMS: '0001-01-01T00:00:00Z'
                    MsgMetaInfo:
                      TargetID: ''
                      TargetSender: ''
                      TargetChat: ''
                      DeprecatedLIDSession: null
                      ThreadMessageID: ''
                      ThreadMessageSenderJID: ''
                    VerifiedName: null
                    DeviceSentMeta: null
                  Message:
                    locationMessage:
                      degreesLatitude: -16.505538233564373
                      degreesLongitude: -151.7422770494996
                      name: Location Name
                      address: Location Address
                      contextInfo: {}
                  MessageContextInfo:
                    stanzaID: ''
                    participant: ''
                    quotedMessage:
                      conversation: ''
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: >-
                    Invalid request data. Location and recipient information are
                    required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/location
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/location
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to send location message
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/location
                  method: POST
        '404':
          description: Not Found - Recipient not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Recipient not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/location
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/location
                  method: POST
components:
  schemas:
    SendLocation:
      type: object
      properties:
        address:
          type: string
        delay:
          type: integer
        id:
          type: string
        latitude:
          type: number
        longitude:
          type: number
        mentionAll:
          type: boolean
        mentionedJid:
          type: string
        name:
          type: string
        number:
          type: string
        quoted:
          $ref: '#/components/schemas/QuotedMessage'
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string
    QuotedMessage:
      type: object
      properties:
        messageId:
          type: string
        participant:
          type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Send a media message

> Send a media message



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/send-message.yaml post /send/media
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Send Message
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /send/media:
    post:
      summary: Send a media message
      description: Send a media message
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SendMedia'
        description: Message data
      responses:
        '200':
          description: Media message sent successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                  messageId:
                    type: string
              example:
                data:
                  Info:
                    Chat: 5511999999999@s.whatsapp.net
                    Sender: 5511888888888:24@s.whatsapp.net
                    IsFromMe: true
                    IsGroup: false
                    AddressingMode: ''
                    SenderAlt: ''
                    RecipientAlt: ''
                    BroadcastListOwner: ''
                    BroadcastRecipients: null
                    ID: 3EB0000000000000000007
                    ServerID: 0
                    Type: DocumentMessage
                    PushName: ''
                    Timestamp: '2026-01-15T10:30:00.000000-03:00'
                    Category: ''
                    Multicast: false
                    MediaType: ''
                    Edit: ''
                    MsgBotInfo:
                      EditType: ''
                      EditTargetID: ''
                      EditSenderTimestampMS: '0001-01-01T00:00:00Z'
                    MsgMetaInfo:
                      TargetID: ''
                      TargetSender: ''
                      TargetChat: ''
                      DeprecatedLIDSession: null
                      ThreadMessageID: ''
                      ThreadMessageSenderJID: ''
                    VerifiedName: null
                    DeviceSentMeta: null
                  Message:
                    documentWithCaptionMessage:
                      message:
                        documentMessage:
                          URL: https://mmg.whatsapp.net/...
                          mimetype: application/pdf
                          fileSHA256: base64-encoded-hash
                          fileLength: 71689
                          mediaKey: base64-encoded-key
                          fileName: file.pdf
                          fileEncSHA256: base64-encoded-hash
                          directPath: /v/t62.7119-24/...
                          contextInfo: {}
                          caption: caption text
                  MessageContextInfo:
                    stanzaID: ''
                    participant: ''
                    quotedMessage:
                      conversation: ''
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: >-
                    Invalid request data. Media and recipient information are
                    required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/media
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/media
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to send media message
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/media
                  method: POST
        '404':
          description: Not Found - Recipient not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Recipient not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/media
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/media
                  method: POST
components:
  schemas:
    SendMedia:
      type: object
      properties:
        caption:
          type: string
        delay:
          type: integer
        filename:
          type: string
        id:
          type: string
        mentionAll:
          type: boolean
        mentionedJid:
          type: string
        number:
          type: string
        quoted:
          $ref: '#/components/schemas/QuotedMessage'
        type:
          type: string
        url:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string
    QuotedMessage:
      type: object
      properties:
        messageId:
          type: string
        participant:
          type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Send a poll message

> Send a poll message



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/send-message.yaml post /send/poll
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Send Message
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /send/poll:
    post:
      summary: Send a poll message
      description: Send a poll message
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SendPoll'
        description: Message data
      responses:
        '200':
          description: Poll message sent successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                  messageId:
                    type: string
              example:
                data:
                  Info:
                    Chat: 5511999999999@s.whatsapp.net
                    Sender: 5511888888888:24@s.whatsapp.net
                    IsFromMe: true
                    IsGroup: false
                    AddressingMode: ''
                    SenderAlt: ''
                    RecipientAlt: ''
                    BroadcastListOwner: ''
                    BroadcastRecipients: null
                    ID: 3EB0000000000000000008
                    ServerID: 0
                    Type: PollCreationMessage
                    PushName: ''
                    Timestamp: '2026-01-15T10:30:00.000000-03:00'
                    Category: ''
                    Multicast: false
                    MediaType: ''
                    Edit: ''
                    MsgBotInfo:
                      EditType: ''
                      EditTargetID: ''
                      EditSenderTimestampMS: '0001-01-01T00:00:00Z'
                    MsgMetaInfo:
                      TargetID: ''
                      TargetSender: ''
                      TargetChat: ''
                      DeprecatedLIDSession: null
                      ThreadMessageID: ''
                      ThreadMessageSenderJID: ''
                    VerifiedName: null
                    DeviceSentMeta: null
                  Message:
                    messageContextInfo:
                      messageSecret: base64-encoded-secret
                    pollCreationMessage:
                      name: poll question
                      options:
                        - optionName: option1
                        - optionName: option2
                      selectableOptionsCount: 0
                      contextInfo: {}
                  MessageContextInfo:
                    stanzaID: ''
                    participant: ''
                    quotedMessage:
                      conversation: ''
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: >-
                    Invalid request data. Poll and recipient information are
                    required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/poll
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/poll
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to send poll message
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/poll
                  method: POST
        '404':
          description: Not Found - Recipient not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Recipient not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/poll
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/poll
                  method: POST
components:
  schemas:
    SendPoll:
      type: object
      properties:
        delay:
          type: integer
        id:
          type: string
        maxAnswer:
          type: integer
        mentionAll:
          type: boolean
        mentionedJid:
          type: string
        number:
          type: string
        options:
          items:
            type: string
          type: array
        question:
          type: string
        quoted:
          $ref: '#/components/schemas/QuotedMessage'
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string
    QuotedMessage:
      type: object
      properties:
        messageId:
          type: string
        participant:
          type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Send a sticker message

> Send a sticker message



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/send-message.yaml post /send/sticker
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Send Message
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /send/sticker:
    post:
      summary: Send a sticker message
      description: Send a sticker message
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SendSticker'
        description: Message data
      responses:
        '200':
          description: Sticker message sent successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                  messageId:
                    type: string
              example:
                data:
                  Info:
                    Chat: 5511999999999@s.whatsapp.net
                    Sender: 5511888888888:24@s.whatsapp.net
                    IsFromMe: true
                    IsGroup: false
                    AddressingMode: ''
                    SenderAlt: ''
                    RecipientAlt: ''
                    BroadcastListOwner: ''
                    BroadcastRecipients: null
                    ID: 3EB0000000000000000009
                    ServerID: 0
                    Type: StickerMessage
                    PushName: ''
                    Timestamp: '2026-01-15T10:30:00.000000-03:00'
                    Category: ''
                    Multicast: false
                    MediaType: ''
                    Edit: ''
                    MsgBotInfo:
                      EditType: ''
                      EditTargetID: ''
                      EditSenderTimestampMS: '0001-01-01T00:00:00Z'
                    MsgMetaInfo:
                      TargetID: ''
                      TargetSender: ''
                      TargetChat: ''
                      DeprecatedLIDSession: null
                      ThreadMessageID: ''
                      ThreadMessageSenderJID: ''
                    VerifiedName: null
                    DeviceSentMeta: null
                  Message:
                    stickerMessage:
                      URL: https://mmg.whatsapp.net/...
                      fileSHA256: base64-encoded-hash
                      fileEncSHA256: base64-encoded-hash
                      mediaKey: base64-encoded-key
                      mimetype: image/webp
                      directPath: /o1/v/t24/...
                      fileLength: 8640
                      contextInfo: {}
                  MessageContextInfo:
                    stanzaID: ''
                    participant: ''
                    quotedMessage:
                      conversation: ''
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: >-
                    Invalid request data. Sticker and recipient information are
                    required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/sticker
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/sticker
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to send sticker message
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/sticker
                  method: POST
        '404':
          description: Not Found - Recipient not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Recipient not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/sticker
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/sticker
                  method: POST
components:
  schemas:
    SendSticker:
      type: object
      properties:
        delay:
          type: integer
        id:
          type: string
        mentionAll:
          type: boolean
        mentionedJid:
          type: string
        number:
          type: string
        quoted:
          $ref: '#/components/schemas/QuotedMessage'
        sticker:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string
    QuotedMessage:
      type: object
      properties:
        messageId:
          type: string
        participant:
          type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Send a text message

> Send a text message



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/send-message.yaml post /send/text
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Send Message
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /send/text:
    post:
      summary: Send a text message
      description: Send a text message
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SendText'
        description: Message data
      responses:
        '200':
          description: Text message sent successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                  messageId:
                    type: string
              example:
                data:
                  Info:
                    Chat: 5511999999999@s.whatsapp.net
                    Sender: 5511888888888:24@s.whatsapp.net
                    IsFromMe: true
                    IsGroup: false
                    AddressingMode: ''
                    SenderAlt: ''
                    RecipientAlt: ''
                    BroadcastListOwner: ''
                    BroadcastRecipients: null
                    ID: 3EB0000000000000000010
                    ServerID: 0
                    Type: ExtendedTextMessage
                    PushName: ''
                    Timestamp: '2026-01-15T10:30:00.000000-03:00'
                    Category: ''
                    Multicast: false
                    MediaType: ''
                    Edit: ''
                    MsgBotInfo:
                      EditType: ''
                      EditTargetID: ''
                      EditSenderTimestampMS: '0001-01-01T00:00:00Z'
                    MsgMetaInfo:
                      TargetID: ''
                      TargetSender: ''
                      TargetChat: ''
                      DeprecatedLIDSession: null
                      ThreadMessageID: ''
                      ThreadMessageSenderJID: ''
                    VerifiedName: null
                    DeviceSentMeta: null
                  Message:
                    extendedTextMessage:
                      text: message text
                      contextInfo: {}
                  MessageContextInfo:
                    stanzaID: ''
                    participant: ''
                    quotedMessage:
                      conversation: ''
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: >-
                    Invalid request data. Text and recipient information are
                    required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/text
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/text
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to send text message
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/text
                  method: POST
        '404':
          description: Not Found - Recipient not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Recipient not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/text
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /send/text
                  method: POST
components:
  schemas:
    SendText:
      type: object
      properties:
        delay:
          type: integer
        id:
          type: string
        mentionAll:
          type: boolean
        mentionedJid:
          type: string
        number:
          type: string
        quoted:
          $ref: '#/components/schemas/QuotedMessage'
        text:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string
    QuotedMessage:
      type: object
      properties:
        messageId:
          type: string
        participant:
          type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Set a user's profile picture

> Set a user's profile picture



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/user.yaml post /user/profile
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - User
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /user/profile:
    post:
      summary: Set a user's profile picture
      description: Set a user's profile picture
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SetProfilePicture'
        description: Profile picture data
      responses:
        '200':
          description: Profile picture set successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                data:
                  image: https://i.imgur.com/example.jpeg
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Profile picture is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/profile
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/profile
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to set profile picture
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/profile
                  method: POST
        '404':
          description: Not Found - User not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: User not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/profile
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/profile
                  method: POST
components:
  schemas:
    SetProfilePicture:
      type: object
      properties:
        image:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Set chat presence

> Set chat presence



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-message.yaml post /message/presence
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Message
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /message/presence:
    post:
      summary: Set chat presence
      description: Set chat presence
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ChatPresence'
        description: Set chat presence
      responses:
        '200':
          description: Chat presence set successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                data:
                  timestamp: 0001-01-01 00:00:00 +0000 UTC
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Chat presence information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/presence
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/presence
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to set chat presence
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/presence
                  method: POST
        '404':
          description: Not Found - Chat not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Chat not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/presence
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /message/presence
                  method: POST
components:
  schemas:
    ChatPresence:
      type: object
      properties:
        isAudio:
          type: boolean
        number:
          type: string
        state:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Set group name

> Set group name



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-group.yaml post /group/name
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Group
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /group/name:
    post:
      summary: Set group name
      description: Set group name
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SetGroupName'
        description: Group data
      responses:
        '200':
          description: Group name set successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Group name is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/name
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/name
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to set group name
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/name
                  method: POST
        '404':
          description: Not Found - Group not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Group not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/name
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/name
                  method: POST
components:
  schemas:
    SetGroupName:
      type: object
      properties:
        groupJid:
          type: string
        name:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Set group photo

> Set group photo



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-group.yaml post /group/photo
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Group
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /group/photo:
    post:
      summary: Set group photo
      description: Set group photo
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SetGroupPhoto'
        description: Group data
      responses:
        '200':
          description: Group photo set successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                data: 82.218-369
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Group photo is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/photo
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/photo
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to set group photo
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/photo
                  method: POST
        '404':
          description: Not Found - Group not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Group not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/photo
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/photo
                  method: POST
components:
  schemas:
    SetGroupPhoto:
      type: object
      properties:
        groupJid:
          type: string
        image:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# SetupOrion

> Instalação automatizada do Evolution Go com SetupOrion

O <a href="https://oriondesign.art.br/" target="_blank">SetupOrion</a> é um instalador automatizado que configura toda a infraestrutura necessária para rodar o Evolution Go em uma VPS limpa, incluindo Docker, Traefik, Portainer e Docker Swarm.

## Pré-requisitos

* VPS com **Debian 11** ou **Ubuntu 20.04** (sistema limpo)
* Registro DNS (tipo A) apontando para o IP da VPS
* Acesso root ao servidor

***

## Passo 1: Executar o SetupOrion

Em uma VPS vazia, execute o comando abaixo e aguarde enquanto o SetupOrion instala todas as dependências necessárias. Ao finalizar, você será direcionado ao menu de ferramentas.

```bash theme={null}
bash <(curl -sSL setup.oriondesign.art.br)
```

## Passo 2: Instalar Traefik e Portainer

No menu de ferramentas, selecione a **Opção 1** para instalar:

* Docker
* Docker Swarm (inicialização e criação de redes)
* Traefik (proxy reverso com SSL automático)
* Portainer (gerenciamento visual de containers)

Responda as perguntas que aparecem na tela para que o Setup possa realizar as instalações corretamente.

## Passo 3: Instalar o Evolution Go

Retorne ao menu de ferramentas e selecione a **Opção 3 (Evolution)**:

1. Escolha a versão: **EvoGO**
2. Informe o domínio configurado no DNS para a aplicação

## Passo 4: Verificar a instalação

Após a instalação ser finalizada, você verá uma tela informando:

* **Dados de acesso** da aplicação
* **Links** para a documentação

<Tip>
  Anote as credenciais exibidas no terminal. Elas serão necessárias para acessar o Evolution Go.
</Tip>


---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Subscribe newsletter

> Subscribe newsletter



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/newsletter.yaml post /newsletter/subscribe
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Newsletter
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /newsletter/subscribe:
    post:
      summary: Subscribe newsletter
      description: Subscribe newsletter
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/GetNewsletter'
        description: Newsletter data
      responses:
        '200':
          description: Subscribed to newsletter successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Newsletter information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/subscribe
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/subscribe
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to subscribe to newsletter
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/subscribe
                  method: POST
        '404':
          description: Not Found - Newsletter not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Newsletter not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/subscribe
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /newsletter/subscribe
                  method: POST
components:
  schemas:
    GetNewsletter:
      type: object
      properties:
        jid:
          $ref: '#/components/schemas/JID'
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string
    JID:
      type: object
      properties:
        device:
          type: integer
        integrator:
          type: integer
        rawAgent:
          type: integer
        server:
          type: string
        user:
          type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Unblock a contact

> Unblock a contact



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/user.yaml post /user/unblock
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - User
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /user/unblock:
    post:
      summary: Unblock a contact
      description: Unblock a contact
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BlockUser'
        description: Block data
      responses:
        '200':
          description: Contact unblocked successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                data:
                  DHash: '1700000000000003'
                  JIDs:
                    - 5511999999999@s.whatsapp.net
                    - 5511888888888@s.whatsapp.net
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Contact information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/unblock
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/unblock
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to unblock contact
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/unblock
                  method: POST
        '404':
          description: Not Found - Contact not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Contact not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/unblock
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /user/unblock
                  method: POST
components:
  schemas:
    BlockUser:
      type: object
      properties:
        number:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Unpin a chat

> Unpin a chat



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-chat.yaml post /chat/unpin
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Chat
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /chat/unpin:
    post:
      summary: Unpin a chat
      description: Unpin a chat
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ChatBody'
        description: Chat
      responses:
        '200':
          description: Chat unpinned successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                data:
                  timestamp: 0001-01-01 00:00:00 +0000 UTC
                message: success
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Chat information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /chat/unpin
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /chat/unpin
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to unpin chat
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /chat/unpin
                  method: POST
        '404':
          description: Not Found - Chat not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Chat not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /chat/unpin
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /chat/unpin
                  method: POST
components:
  schemas:
    ChatBody:
      type: object
      properties:
        number:
          type: string
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Update participant

> Update participant



## OpenAPI

````yaml /api-reference/openapi/Evolution-Go/evo-go-group.yaml post /group/participant
openapi: 3.0.0
info:
  title: Evolution Foundation - Evolution Go - Group
  description: Go implementation of Evolution
  version: '1.0'
servers:
  - url: http://localhost:8080/
    description: Development server (HTTP)
  - url: https://localhost:8080/
    description: Development server (HTTPS)
  - url: '{customUrl}'
    description: Custom server
    variables:
      customUrl:
        default: https://your-instance.com
        description: Enter your server URL
security: []
paths:
  /group/participant:
    post:
      summary: Update participant
      description: Update participant
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AddGroupParticipant'
        description: Group data
      responses:
        '200':
          description: >
            ⚠️ BUG CONHECIDO: Este endpoint retorna erro 400 com "participants
            is required and cannot be empty" mesmo com payload correto.
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
              example:
                error: participants is required and cannot be empty
        '400':
          description: Bad Request - Invalid input data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: BAD_REQUEST
                  message: Invalid request data. Participant information is required.
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/participant
                  method: POST
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: UNAUTHORIZED
                  message: Invalid or missing API key
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/participant
                  method: POST
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: FORBIDDEN
                  message: Insufficient permissions to update participant
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/participant
                  method: POST
        '404':
          description: Not Found - Group or participant not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: NOT_FOUND
                  message: Group or participant not found
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/participant
                  method: POST
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: INTERNAL_SERVER_ERROR
                  message: An unexpected error occurred
                meta:
                  timestamp: '2024-01-15T10:30:00Z'
                  path: /group/participant
                  method: POST
components:
  schemas:
    AddGroupParticipant:
      type: object
      properties:
        action:
          $ref: '#/components/schemas/ParticipantChange'
        groupJid:
          $ref: '#/components/schemas/JID'
        participants:
          items:
            type: string
          type: array
    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            path:
              type: string
            method:
              type: string
    ParticipantChange:
      type: string
      enum:
        - add
        - remove
        - promote
        - demote
      x-enum-varnames:
        - ParticipantChangeAdd
        - ParticipantChangeRemove
        - ParticipantChangePromote
        - ParticipantChangeDemote
    JID:
      type: object
      properties:
        device:
          type: integer
        integrator:
          type: integer
        rawAgent:
          type: integer
        server:
          type: string
        user:
          type: string

````

---

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.evolutionfoundation.com.br/llms.txt
> Use this file to discover all available pages before exploring further.

# Webhooks

Os Webhooks permitem que o Evolution Go envie notificações em tempo real para sua aplicação quando eventos ocorrem no WhatsApp, como recebimento de mensagens, atualizações de conexão, chamadas e muito mais.

## Guia Rápido

Siga estes passos para configurar e receber webhooks do Evolution Go.

### Pré-requisitos

Antes de configurar webhooks, você precisa:

1. Ter o Evolution Go **instalado e rodando** — veja o [guia de instalação](/evolution-go/installation)
2. Ter uma **instância criada** — veja [Configuração Inicial](/evolution-go/getting-started)
3. Ter sua **API Key** (`GLOBAL_API_KEY` configurada no `.env`)
4. Ter uma **URL acessível** para receber os eventos

<Tip>
  Para testes rápidos, use o <a href="https://webhook.site" target="_blank">webhook.site</a> para gerar uma URL temporária e visualizar os eventos recebidos em tempo real. Para desenvolvimento local, use o <a href="https://ngrok.com" target="_blank">ngrok</a> para expor seu servidor local à internet.
</Tip>

### Passo 1: Conectar a instância com webhook

Configure o webhook ao conectar sua instância enviando uma requisição para o endpoint de conexão.

#### Método

```
POST {BASE_URL}/instance/connect
```

#### Header

| Key          | Value                                  | Descrição                                 |
| ------------ | -------------------------------------- | ----------------------------------------- |
| Content-Type | `application/json`                     | Tipo do conteúdo                          |
| apikey       | `SUA_GLOBAL_API_KEY`                   | Chave de API global configurada no `.env` |
| instanceId   | `249aad2e-68f9-464f-bc84-aca560c38f0e` | UUID da instância que deseja conectar     |

<Warning>
  A API Key é o valor da variável `GLOBAL_API_KEY` configurada no arquivo `.env` do Evolution Go. Nunca exponha essa chave publicamente. Veja mais detalhes em [Configuração Inicial](/evolution-go/getting-started#passo-2-login-no-painel).
</Warning>

#### Body

```json theme={null}
{
  "webhookUrl": "https://webhook.site/seu-id-unico",
  "subscribe": ["ALL"],
  "immediate": true
}
```

#### Exemplo com cURL

```bash theme={null}
curl -X POST 'http://localhost:8080/instance/connect' \
  -H 'Content-Type: application/json' \
  -H 'apikey: SUA_GLOBAL_API_KEY' \
  -H 'instanceId: 249aad2e-68f9-464f-bc84-aca560c38f0e' \
  -d '{
    "webhookUrl": "https://webhook.site/seu-id-unico",
    "subscribe": ["ALL"],
    "immediate": true
  }'
```

#### Exemplo com JavaScript

```javascript theme={null}
const response = await fetch('http://localhost:8080/instance/connect', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': 'SUA_GLOBAL_API_KEY',
    'instanceId': '249aad2e-68f9-464f-bc84-aca560c38f0e'
  },
  body: JSON.stringify({
    webhookUrl: 'https://webhook.site/seu-id-unico',
    subscribe: ['ALL'],
    immediate: true
  })
});

const data = await response.json();
console.log(data);
```

#### Exemplo com Python

```python theme={null}
import requests

response = requests.post(
    'http://localhost:8080/instance/connect',
    headers={
        'Content-Type': 'application/json',
        'apikey': 'SUA_GLOBAL_API_KEY',
        'instanceId': '249aad2e-68f9-464f-bc84-aca560c38f0e'
    },
    json={
        'webhookUrl': 'https://webhook.site/seu-id-unico',
        'subscribe': ['ALL'],
        'immediate': True
    }
)

print(response.json())
```

### Passo 2: Parear com o WhatsApp

Após a conexão, você receberá um evento `QRCode` no seu webhook com a imagem do QR Code em base64:

1. Abra o **WhatsApp** no celular
2. Vá em **Configurações > Dispositivos conectados > Conectar dispositivo**
3. Escaneie o QR Code recebido no webhook (decodifique o campo `qrcode` base64 para exibir a imagem)

<Note>
  Se preferir usar **Pairing Code** ao invés de QR Code, envie o campo `phone` no body:

  ```json theme={null}
  {
    "webhookUrl": "https://webhook.site/seu-id-unico",
    "subscribe": ["ALL"],
    "phone": "5511999999999"
  }
  ```
</Note>

### Passo 3: Confirmar a conexão

Após o pareamento bem-sucedido, você receberá uma sequência de eventos: `PairSuccess` → `Connected` → `OfflineSyncCompleted`. Se recebeu esses 3 eventos, seu webhook está configurado corretamente.

### Passo 4: Receber mensagens

A partir de agora, toda mensagem recebida no WhatsApp será enviada como evento `Message` para sua URL.

```
Usuário envia mensagem → WhatsApp → Evolution Go → HTTP POST → Seu Webhook
```

#### Processando no seu servidor

<CodeGroup>
  ```javascript Node.js (Express) theme={null}
  const express = require('express');
  const app = express();
  app.use(express.json());

  app.post('/webhook', (req, res) => {
    const { event, data, instanceId } = req.body;

    switch (event) {
      case 'Message':
        const sender = data.Info.PushName || data.Info.Sender;
        const text = data.Message.conversation;
        console.log(`[${instanceId}] ${sender}: ${text}`);
        break;
      case 'Connected':
        console.log(`Instância ${instanceId} conectada!`);
        break;
      case 'QRCode':
        console.log(`QR Code recebido para ${instanceId}`);
        break;
      default:
        console.log(`Evento: ${event}`);
    }

    res.status(200).json({ received: true });
  });

  app.listen(3000, () => console.log('Webhook rodando na porta 3000'));
  ```

  ```python Python (Flask) theme={null}
  from flask import Flask, request, jsonify

  app = Flask(__name__)

  @app.route('/webhook', methods=['POST'])
  def webhook():
      payload = request.json
      event = payload.get('event')
      data = payload.get('data', {})
      instance_id = payload.get('instanceId')

      if event == 'Message':
          sender = data.get('Info', {}).get('PushName', data.get('Info', {}).get('Sender'))
          text = data.get('Message', {}).get('conversation', '')
          print(f'[{instance_id}] {sender}: {text}')
      elif event == 'Connected':
          print(f'Instância {instance_id} conectada!')
      elif event == 'QRCode':
          print(f'QR Code recebido para {instance_id}')
      else:
          print(f'Evento: {event}')

      return jsonify({'received': True}), 200

  if __name__ == '__main__':
      app.run(port=3000)
  ```
</CodeGroup>

<Warning>
  Seu endpoint **deve** responder com status HTTP `2xx` (200-299) em até 30 segundos. Caso contrário, o Evolution Go fará até **5 retentativas** com intervalo de **30 segundos** entre cada uma.
</Warning>

***

## Configuração Detalhada

A configuração de webhooks é feita no momento da conexão da instância, através do endpoint `POST /instance/connect`.

### Webhook por Instância

Ao conectar uma instância, você pode definir a URL do webhook e os eventos que deseja receber:

```json POST /instance/connect theme={null}
{
  "webhookUrl": "https://seu-dominio.com/webhook",
  "subscribe": [
    "MESSAGE",
    "SEND_MESSAGE",
    "CONNECTION",
    "QRCODE"
  ],
  "immediate": true,
  "phone": "5511999999999"
}
```

### Parâmetros

| Parâmetro       | Tipo      | Obrigatório | Descrição                                                                 |
| --------------- | --------- | ----------- | ------------------------------------------------------------------------- |
| webhookUrl      | string    | Não         | URL que receberá os eventos via HTTP POST                                 |
| subscribe       | string\[] | Não         | Lista de tipos de eventos para receber. Se vazio, recebe apenas `MESSAGE` |
| immediate       | boolean   | Não         | Conectar imediatamente sem aguardar QR Code                               |
| phone           | string    | Não         | Número de telefone para pareamento                                        |
| rabbitmqEnable  | string    | Não         | `"enabled"` para ativar envio via RabbitMQ                                |
| websocketEnable | string    | Não         | `"enabled"` para ativar envio via WebSocket                               |
| natsEnable      | string    | Não         | `"enabled"` para ativar envio via NATS                                    |

### Webhook Global

Você pode definir um webhook global via variável de ambiente. Ele receberá eventos de **todas** as instâncias, além dos webhooks individuais de cada instância.

```bash .env theme={null}
# URL do webhook global (recebe eventos de todas as instâncias)
WEBHOOK_URL=https://seu-dominio.com/webhook/global

# Incluir arquivos de mídia no payload do webhook (padrão: true)
WEBHOOK_FILES=true
```

<Note>
  Quando configurados, **ambos** os webhooks são acionados: o global (definido por `WEBHOOK_URL`) e o da instância (definido em `webhookUrl`). Isso permite ter um sistema centralizado de monitoramento junto com integrações específicas por instância.
</Note>

## Tipos de Eventos

Ao configurar o webhook, você pode se inscrever nos seguintes tipos de eventos:

| Tipo de Evento  | Descrição                               | Eventos Incluídos                                               |
| --------------- | --------------------------------------- | --------------------------------------------------------------- |
| `ALL`           | Recebe todos os eventos disponíveis     | Todos abaixo                                                    |
| `MESSAGE`       | Mensagens recebidas                     | `Message`                                                       |
| `SEND_MESSAGE`  | Mensagens enviadas                      | `SendMessage`                                                   |
| `READ_RECEIPT`  | Confirmações de leitura                 | `Receipt` (Read, ReadSelf, Delivered)                           |
| `PRESENCE`      | Status de presença online/offline       | `Presence`                                                      |
| `HISTORY_SYNC`  | Sincronização de histórico              | `HistorySync`                                                   |
| `CHAT_PRESENCE` | Presença em chats (digitando, gravando) | `ChatPresence`, `Archive`                                       |
| `CALL`          | Eventos de chamada                      | `CallOffer`, `CallRelayLatency`, `CallTerminate`                |
| `CONNECTION`    | Status de conexão                       | `Connected`, `PairSuccess`, `LoggedOut`, `OfflineSyncCompleted` |
| `LABEL`         | Gerenciamento de etiquetas              | `LabelEdit`, `LabelAssociationChat`, `LabelAssociationMessage`  |
| `CONTACT`       | Atualizações de contatos                | `Contact`, `PushName`                                           |
| `GROUP`         | Eventos de grupos                       | `GroupInfo`, `JoinedGroup`                                      |
| `NEWSLETTER`    | Eventos de canais/newsletters           | `NewsletterJoin`, `NewsletterLeave`                             |
| `QRCODE`        | Eventos de QR Code                      | `QRCode`, `QRTimeout`, `QRSuccess`                              |

<Tip>
  Use `"ALL"` na lista de `subscribe` para receber todos os eventos sem precisar listar cada um individualmente.
</Tip>

## Estrutura do Payload

Todos os webhooks são enviados como requisições `HTTP POST` com `Content-Type: application/json`. A estrutura base do payload é:

```json theme={null}
{
  "event": "NomeDoEvento",
  "data": { ... },
  "instanceId": "uuid-da-instancia",
  "instanceToken": "token_da_instancia"
}
```

| Campo         | Tipo   | Descrição                                      |
| ------------- | ------ | ---------------------------------------------- |
| event         | string | Nome do evento que ocorreu                     |
| data          | object | Dados específicos do evento (varia por evento) |
| instanceId    | string | UUID da instância                              |
| instanceToken | string | Token de autenticação da instância             |

***

## Payloads por Evento

### QRCode

Emitido quando um novo QR Code é gerado para pareamento.

```json theme={null}
{
  "event": "QRCode",
  "data": {
    "code": "2@DoOPPlssTlSoDDdtPFXDXNp24ImY0bxwSivPLNbNLtCgXOYGFnsCN1Y64QYQB/r5tAmNqt0zhaf3TyOydXGZYGnKqB3UNTPDx1M=,...",
    "qrcode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEA..."
  },
  "instanceId": "249aad2e-68f9-464f-bc84-aca560c38f0e",
  "instanceToken": "2ef79c34-b6e1-4969-9e37-12b3d3a9d1062"
}
```

| Campo       | Tipo   | Descrição                         |
| ----------- | ------ | --------------------------------- |
| data.code   | string | Código do QR Code para pareamento |
| data.qrcode | string | Imagem do QR Code em base64 (PNG) |

***

### PairSuccess

Emitido quando o pareamento do dispositivo é concluído com sucesso.

```json theme={null}
{
  "event": "PairSuccess",
  "data": {
    "BusinessName": "",
    "ID": "5511918798714:5@s.whatsapp.net",
    "Platform": "android",
    "jid": "5511918798714:5@s.whatsapp.net",
    "pushName": "",
    "status": "open"
  },
  "instanceId": "249aad2e-68f9-464f-bc84-aca560c38f0e",
  "instanceToken": "2ef79c34-b6e1-4969-9e37-12b3d3a9d1062"
}
```

| Campo             | Tipo   | Descrição                                    |
| ----------------- | ------ | -------------------------------------------- |
| data.BusinessName | string | Nome da empresa (para contas Business)       |
| data.ID           | string | JID completo do dispositivo pareado          |
| data.Platform     | string | Plataforma do dispositivo (`android`, `ios`) |
| data.jid          | string | JID do WhatsApp                              |
| data.pushName     | string | Nome de exibição do perfil                   |
| data.status       | string | Status da conexão (`open`)                   |

***

### Message

Emitido quando uma mensagem é recebida. O payload varia conforme o tipo de mensagem. Todos os eventos de mensagem compartilham a mesma estrutura base em `data`, com o objeto `Info` contendo metadados e `Message` contendo o conteúdo.

#### Campos comuns do objeto `Info`

| Campo             | Tipo    | Descrição                                               |
| ----------------- | ------- | ------------------------------------------------------- |
| Info.Chat         | string  | JID do chat (individual ou grupo)                       |
| Info.Sender       | string  | JID do remetente                                        |
| Info.SenderAlt    | string  | JID alternativo do remetente (LID)                      |
| Info.IsFromMe     | boolean | `true` se a mensagem foi enviada pela própria instância |
| Info.IsGroup      | boolean | `true` se a mensagem é de um grupo                      |
| Info.ID           | string  | ID único da mensagem                                    |
| Info.Type         | string  | Tipo da mensagem (`text`, `media`, etc.)                |
| Info.PushName     | string  | Nome de exibição do remetente                           |
| Info.Timestamp    | string  | Data/hora da mensagem (ISO 8601)                        |
| Info.MediaType    | string  | Tipo de mídia (`image`, `video`, `audio`, `document`)   |
| Info.VerifiedName | object  | Informações do nome verificado (contas Business)        |

#### Campos comuns adicionais

| Campo                 | Tipo    | Descrição                                  |
| --------------------- | ------- | ------------------------------------------ |
| IsEphemeral           | boolean | Mensagem temporária                        |
| IsViewOnce            | boolean | Mensagem que pode ser vista apenas uma vez |
| IsViewOnceV2          | boolean | Mensagem view once v2                      |
| IsViewOnceV2Extension | boolean | Extensão view once v2                      |
| IsDocumentWithCaption | boolean | Documento com legenda                      |
| IsLottieSticker       | boolean | Sticker animado Lottie                     |
| IsEdit                | boolean | Mensagem editada                           |

#### Text

```json theme={null}
{
  "event": "Message",
  "data": {
    "Info": {
      "Chat": "557499879409@s.whatsapp.net",
      "Sender": "557499879409:38@s.whatsapp.net",
      "SenderAlt": "123234343434@lid",
      "IsFromMe": false,
      "IsGroup": false,
      "ID": "3EB0C05FF2D3A0068B2A2D",
      "Type": "text",
      "PushName": "Davidson Gomes",
      "Timestamp": "2024-10-10T17:17:44-03:00",
      "MediaType": "",
      "VerifiedName": {
        "Certificate": {
          "details": "CJOzjf3Oh/LGQBIGc21iOndhIg5EYXZpZHNvbiBHb21lcw==",
          "signature": "KjXTl5LfeToLO6bFflbHyiBQe7a1zly4Wdhhf2XPU1Lq8tj9p03hvYUjbs+M0ChWBQhjy/NBq7+nYCKQlLP3Bw=="
        },
        "Details": {
          "serial": 4651594154187643283,
          "issuer": "smb:wa",
          "verifiedName": "Davidson Gomes"
        }
      }
    },
    "Message": {
      "conversation": "oi",
      "messageContextInfo": {
        "deviceListMetadata": {
          "senderKeyHash": "jS2BFebH+KJxzA==",
          "senderTimestamp": 1728407293
        },
        "deviceListMetadataVersion": 2
      }
    },
    "IsEphemeral": false,
    "IsViewOnce": false,
    "IsEdit": false
  },
  "instanceId": "249aad2e-68f9-464f-bc84-aca560c38f0e",
  "instanceToken": "2ef79c34-b6e1-4969-9e37-12b3d3a9d1062"
}
```

#### Image

Quando `WEBHOOK_FILES=true` (padrão), o campo `base64` contém a imagem codificada. Caso contrário, `mediaUrl` apontará para o armazenamento MinIO/S3.

```json theme={null}
{
  "event": "Message",
  "data": {
    "Info": {
      "Chat": "557499879409@s.whatsapp.net",
      "Sender": "557499879409:45@s.whatsapp.net",
      "IsFromMe": false,
      "IsGroup": false,
      "ID": "3EB0546D154AB4C90A11E1",
      "Type": "media",
      "PushName": "Davidson Gomes",
      "Timestamp": "2024-10-23T09:15:41-03:00",
      "MediaType": "image"
    },
    "Message": {
      "imageMessage": {
        "url": "https://mmg.whatsapp.net/v/...",
        "mimetype": "image/jpeg",
        "fileSha256": "...",
        "fileLength": 82247,
        "height": 1600,
        "width": 1200,
        "mediaKey": "...",
        "fileEncSha256": "...",
        "directPath": "/v/...",
        "mediaKeyTimestamp": 1729685741,
        "scansSidecar": "...",
        "scanLengths": [20898],
        "midQualityFileSha256": "..."
      },
      "base64": "/9j/4AAQSkZJRgABAQAAAQABAAD/..."
    },
    "IsEphemeral": false,
    "IsViewOnce": false,
    "IsEdit": false
  },
  "instanceId": "249aad2e-68f9-464f-bc84-aca560c38f0e",
  "instanceToken": "2ef79c34-b6e1-4969-9e37-12b3d3a9d1062"
}
```

#### Video

```json theme={null}
{
  "event": "Message",
  "data": {
    "Info": {
      "Chat": "557499879409@s.whatsapp.net",
      "Sender": "557499879409:45@s.whatsapp.net",
      "IsFromMe": false,
      "IsGroup": false,
      "ID": "3EB0A1B2C3D4E5F6071234",
      "Type": "media",
      "PushName": "Davidson Gomes",
      "Timestamp": "2024-10-23T09:20:00-03:00",
      "MediaType": "video"
    },
    "Message": {
      "videoMessage": {
        "url": "https://mmg.whatsapp.net/v/...",
        "mimetype": "video/mp4",
        "fileSha256": "...",
        "fileLength": 1048576,
        "seconds": 15,
        "mediaKey": "...",
        "fileEncSha256": "...",
        "directPath": "/v/...",
        "mediaKeyTimestamp": 1729685741
      },
      "base64": "AAAAIGZ0eXBpc29tAAACAGlzb21pc28y..."
    },
    "IsEphemeral": false,
    "IsViewOnce": false,
    "IsEdit": false
  },
  "instanceId": "249aad2e-68f9-464f-bc84-aca560c38f0e",
  "instanceToken": "2ef79c34-b6e1-4969-9e37-12b3d3a9d1062"
}
```

#### Audio

```json theme={null}
{
  "event": "Message",
  "data": {
    "Info": {
      "Chat": "557499879409@s.whatsapp.net",
      "Sender": "557499879409:45@s.whatsapp.net",
      "IsFromMe": false,
      "IsGroup": false,
      "ID": "3EB0F1E2D3C4B5A6091234",
      "Type": "media",
      "PushName": "Davidson Gomes",
      "Timestamp": "2024-10-23T09:25:00-03:00",
      "MediaType": "audio"
    },
    "Message": {
      "audioMessage": {
        "url": "https://mmg.whatsapp.net/v/...",
        "mimetype": "audio/ogg; codecs=opus",
        "fileSha256": "...",
        "fileLength": 25600,
        "seconds": 5,
        "ptt": true,
        "mediaKey": "...",
        "fileEncSha256": "...",
        "directPath": "/v/...",
        "mediaKeyTimestamp": 1729685741,
        "waveform": "AAAAAAAAAAAAAAAA..."
      },
      "base64": "T2dnUwACAAAAAAAAAAA..."
    },
    "IsEphemeral": false,
    "IsViewOnce": false,
    "IsEdit": false
  },
  "instanceId": "249aad2e-68f9-464f-bc84-aca560c38f0e",
  "instanceToken": "2ef79c34-b6e1-4969-9e37-12b3d3a9d1062"
}
```

#### Document

```json theme={null}
{
  "event": "Message",
  "data": {
    "Info": {
      "Chat": "557499879409@s.whatsapp.net",
      "Sender": "557499879409:45@s.whatsapp.net",
      "IsFromMe": false,
      "IsGroup": false,
      "ID": "3EB0D1C2B3A4E5F6071234",
      "Type": "media",
      "PushName": "Davidson Gomes",
      "Timestamp": "2024-10-23T09:30:00-03:00",
      "MediaType": "document"
    },
    "Message": {
      "documentMessage": {
        "url": "https://mmg.whatsapp.net/v/...",
        "mimetype": "application/pdf",
        "title": "documento.pdf",
        "fileSha256": "...",
        "fileLength": 512000,
        "fileName": "documento.pdf",
        "mediaKey": "...",
        "fileEncSha256": "...",
        "directPath": "/v/...",
        "mediaKeyTimestamp": 1729685741
      },
      "base64": "JVBERi0xLjQKJeLj..."
    },
    "IsDocumentWithCaption": false,
    "IsEphemeral": false,
    "IsViewOnce": false,
    "IsEdit": false
  },
  "instanceId": "249aad2e-68f9-464f-bc84-aca560c38f0e",
  "instanceToken": "2ef79c34-b6e1-4969-9e37-12b3d3a9d1062"
}
```

<Note>
  Quando `WEBHOOK_FILES=true` (padrão), mensagens com mídia incluem o conteúdo do arquivo como `base64` dentro do objeto `Message`. Se o MinIO/S3 estiver configurado, o campo `mediaUrl` será adicionado em vez do `base64`.
</Note>

***

### Receipt

Emitido para confirmações de leitura e entrega. O campo `state` no nível raiz indica o tipo: `Read`, `ReadSelf` ou `Delivered`.

```json theme={null}
{
  "event": "Receipt",
  "state": "Read",
  "data": {
    "Chat": "557499879409@s.whatsapp.net",
    "Sender": "5511918798714:5@s.whatsapp.net",
    "IsFromMe": false,
    "IsGroup": false,
    "MessageIDs": ["3EB0C05FF2D3A0068B2A2D"],
    "Timestamp": "2024-10-10T17:18:00-03:00",
    "Type": "read"
  },
  "instanceId": "249aad2e-68f9-464f-bc84-aca560c38f0e",
  "instanceToken": "2ef79c34-b6e1-4969-9e37-12b3d3a9d1062"
}
```

| Campo           | Tipo      | Descrição                                            |
| --------------- | --------- | ---------------------------------------------------- |
| state           | string    | Tipo de confirmação: `Read`, `ReadSelf`, `Delivered` |
| data.Chat       | string    | JID do chat                                          |
| data.Sender     | string    | JID do remetente                                     |
| data.MessageIDs | string\[] | Lista de IDs das mensagens confirmadas               |
| data.Timestamp  | string    | Data/hora da confirmação (ISO 8601)                  |

***

### Connected

Emitido quando a instância se conecta ao WhatsApp com sucesso.

```json theme={null}
{
  "event": "Connected",
  "data": {
    "status": "open",
    "jid": "5511918798714:5@s.whatsapp.net",
    "pushName": "Davidson Gomes"
  },
  "instanceId": "249aad2e-68f9-464f-bc84-aca560c38f0e",
  "instanceToken": "2ef79c34-b6e1-4969-9e37-12b3d3a9d1062"
}
```

***

### LoggedOut

Emitido quando a instância é desconectada do WhatsApp.

```json theme={null}
{
  "event": "LoggedOut",
  "data": {
    "Reason": "logged_out"
  },
  "instanceId": "249aad2e-68f9-464f-bc84-aca560c38f0e",
  "instanceToken": "2ef79c34-b6e1-4969-9e37-12b3d3a9d1062"
}
```

***

### OfflineSyncCompleted

Emitido quando a sincronização offline de mensagens é concluída após a reconexão.

```json theme={null}
{
  "event": "OfflineSyncCompleted",
  "data": {
    "Count": 42
  },
  "instanceId": "249aad2e-68f9-464f-bc84-aca560c38f0e",
  "instanceToken": "2ef79c34-b6e1-4969-9e37-12b3d3a9d1062"
}
```

| Campo      | Tipo | Descrição                                 |
| ---------- | ---- | ----------------------------------------- |
| data.Count | int  | Número de mensagens sincronizadas offline |

***

### CallOffer

Emitido quando uma chamada é recebida.

```json theme={null}
{
  "event": "CallOffer",
  "data": {
    "From": "557499879409@s.whatsapp.net",
    "Timestamp": "2024-10-10T17:20:00-03:00",
    "CallCreator": "557499879409@s.whatsapp.net",
    "CallID": "A1B2C3D4E5F6",
    "RemotePlatform": "android",
    "RemoteVersion": "2.24.10.12"
  },
  "instanceId": "249aad2e-68f9-464f-bc84-aca560c38f0e",
  "instanceToken": "2ef79c34-b6e1-4969-9e37-12b3d3a9d1062"
}
```

| Campo               | Tipo   | Descrição                                 |
| ------------------- | ------ | ----------------------------------------- |
| data.From           | string | JID de quem está ligando                  |
| data.Timestamp      | string | Data/hora da chamada (ISO 8601)           |
| data.CallCreator    | string | JID do criador da chamada                 |
| data.CallID         | string | ID único da chamada                       |
| data.RemotePlatform | string | Plataforma do chamador (`android`, `ios`) |
| data.RemoteVersion  | string | Versão do WhatsApp do chamador            |

***

### CallRelayLatency

Emitido com informações de latência durante uma chamada em andamento.

```json theme={null}
{
  "event": "CallRelayLatency",
  "data": {
    "From": "557499879409@s.whatsapp.net",
    "Timestamp": "2024-10-10T17:20:05-03:00",
    "CallCreator": "557499879409@s.whatsapp.net",
    "CallID": "A1B2C3D4E5F6"
  },
  "instanceId": "249aad2e-68f9-464f-bc84-aca560c38f0e",
  "instanceToken": "2ef79c34-b6e1-4969-9e37-12b3d3a9d1062"
}
```

***

### CallTerminate

Emitido quando uma chamada é encerrada.

```json theme={null}
{
  "event": "CallTerminate",
  "data": {
    "From": "557499879409@s.whatsapp.net",
    "Timestamp": "2024-10-10T17:21:00-03:00",
    "CallCreator": "557499879409@s.whatsapp.net",
    "CallID": "A1B2C3D4E5F6",
    "Reason": "busy"
  },
  "instanceId": "249aad2e-68f9-464f-bc84-aca560c38f0e",
  "instanceToken": "2ef79c34-b6e1-4969-9e37-12b3d3a9d1062"
}
```

| Campo       | Tipo   | Descrição                                        |
| ----------- | ------ | ------------------------------------------------ |
| data.Reason | string | Motivo do encerramento (`busy`, `timeout`, etc.) |

***

### JoinedGroup

Emitido quando a instância entra em um grupo.

```json theme={null}
{
  "event": "JoinedGroup",
  "data": {
    "Reason": "invite",
    "JID": "120363012345678901@g.us",
    "GroupName": {
      "Name": "Equipe Evolution",
      "NameSetAt": "2024-10-01T10:00:00-03:00"
    },
    "GroupCreated": "2024-10-01T10:00:00-03:00",
    "Participants": [
      {
        "JID": "5511918798714@s.whatsapp.net",
        "IsAdmin": true,
        "IsSuperAdmin": true
      }
    ]
  },
  "instanceId": "249aad2e-68f9-464f-bc84-aca560c38f0e",
  "instanceToken": "2ef79c34-b6e1-4969-9e37-12b3d3a9d1062"
}
```

| Campo             | Tipo   | Descrição                          |
| ----------------- | ------ | ---------------------------------- |
| data.Reason       | string | Motivo da entrada (`invite`, etc.) |
| data.JID          | string | JID do grupo                       |
| data.GroupName    | object | Informações do nome do grupo       |
| data.Participants | array  | Lista de participantes com roles   |

***

### GroupInfo

Emitido quando informações de um grupo são atualizadas (nome, descrição, participantes, etc.).

```json theme={null}
{
  "event": "GroupInfo",
  "data": {
    "JID": "120363012345678901@g.us",
    "Sender": "557499879409@s.whatsapp.net",
    "Timestamp": "2024-10-10T17:25:00-03:00",
    "Name": {
      "Name": "Equipe Evolution - Novo Nome",
      "NameSetAt": "2024-10-10T17:25:00-03:00",
      "NameSetBy": "557499879409@s.whatsapp.net"
    },
    "Join": [],
    "Leave": [],
    "Promote": [],
    "Demote": []
  },
  "instanceId": "249aad2e-68f9-464f-bc84-aca560c38f0e",
  "instanceToken": "2ef79c34-b6e1-4969-9e37-12b3d3a9d1062"
}
```

| Campo          | Tipo   | Descrição                              |
| -------------- | ------ | -------------------------------------- |
| data.JID       | string | JID do grupo                           |
| data.Sender    | string | JID de quem fez a alteração            |
| data.Timestamp | string | Data/hora da alteração (ISO 8601)      |
| data.Name      | object | Novo nome do grupo (se alterado)       |
| data.Topic     | object | Nova descrição do grupo (se alterada)  |
| data.Join      | array  | JIDs de usuários que entraram no grupo |
| data.Leave     | array  | JIDs de usuários que saíram do grupo   |
| data.Promote   | array  | JIDs de usuários promovidos a admin    |
| data.Demote    | array  | JIDs de usuários rebaixados de admin   |

***

### NewsletterJoin

Emitido quando a instância entra em um canal/newsletter.

```json theme={null}
{
  "event": "NewsletterJoin",
  "data": {
    "id": "120363123456789012@newsletter",
    "state": {
      "type": "ACTIVE"
    },
    "thread_metadata": {
      "creation_time": "1696118400",
      "invite": "ABC123DEF456",
      "name": {
        "text": "Evolution Go News",
        "id": "1234567890"
      },
      "description": {
        "text": "Canal oficial do Evolution Go"
      },
      "subscribers_count": 1500,
      "verification": "VERIFIED",
      "picture": {
        "url": "https://pps.whatsapp.net/v/..."
      }
    },
    "viewer_metadata": {
      "mute": "OFF",
      "role": "SUBSCRIBER"
    }
  },
  "instanceId": "249aad2e-68f9-464f-bc84-aca560c38f0e",
  "instanceToken": "2ef79c34-b6e1-4969-9e37-12b3d3a9d1062"
}

---

## Política de Retentativas

O Evolution Go possui um sistema automático de retentativas para garantir a entrega dos webhooks:

| Configuração               | Valor              |
| -------------------------- | ------------------ |
| Máximo de tentativas       | **5**              |
| Intervalo entre tentativas | **30 segundos**    |
| Método HTTP                | `POST`             |
| Content-Type               | `application/json` |
| Resposta esperada          | Status HTTP `2xx`  |

Se todas as 5 tentativas falharem, o evento é descartado e um log de erro é registrado.

<Warning>
Certifique-se de que seu endpoint de webhook responda com status HTTP `2xx` (200-299) para confirmar o recebimento. Qualquer resposta fora dessa faixa será tratada como falha e acionará uma nova tentativa.
</Warning>

## Canais de Entrega Alternativos

Além de webhooks HTTP, o Evolution Go suporta outros canais de entrega de eventos:

<CardGroup cols={2}>
  <Card title="RabbitMQ / AMQP" icon="rabbit">
    Envio via filas AMQP. Configure com `rabbitmqEnable: "enabled"` na conexão da instância e as variáveis `AMQP_URL`, `AMQP_GLOBAL_ENABLED` e `AMQP_GLOBAL_EVENTS`.
  </Card>
  <Card title="NATS" icon="bolt">
    Envio via NATS messaging. Configure com `natsEnable: "enabled"` na conexão e as variáveis `NATS_URL`, `NATS_GLOBAL_ENABLED` e `NATS_GLOBAL_EVENTS`.
  </Card>
  <Card title="WebSocket" icon="plug">
    Receba eventos em tempo real via WebSocket. Configure com `websocketEnable: "enabled"` na conexão da instância.
  </Card>
</CardGroup>

<Note>
Múltiplos canais podem ser ativados simultaneamente. Por exemplo, você pode receber eventos via webhook HTTP **e** RabbitMQ ao mesmo tempo.
</Note>

## Variáveis de Ambiente

Todas as variáveis de ambiente relacionadas a eventos e webhooks:

| Variável                | Descrição                                              | Padrão  |
| ----------------------- | ------------------------------------------------------ | ------- |
| `WEBHOOK_URL`           | URL do webhook global                                  | -       |
| `WEBHOOK_FILES`         | Incluir arquivos de mídia nos payloads                 | `true`  |
| `AMQP_URL`              | URL de conexão do RabbitMQ                             | -       |
| `AMQP_GLOBAL_ENABLED`   | Ativar filas globais RabbitMQ                          | `false` |
| `AMQP_GLOBAL_EVENTS`    | Eventos para filas globais (separados por vírgula)     | -       |
| `AMQP_SPECIFIC_EVENTS`  | Eventos para filas específicas (separados por vírgula) | -       |
| `NATS_URL`              | URL de conexão do NATS                                 | -       |
| `NATS_GLOBAL_ENABLED`   | Ativar NATS global                                     | `false` |
| `NATS_GLOBAL_EVENTS`    | Eventos para NATS global (separados por vírgula)       | -       |
| `EVENT_IGNORE_GROUP`    | Ignorar eventos de grupos                              | `false` |
| `EVENT_IGNORE_STATUS`   | Ignorar eventos de status/stories                      | `false` |
```

