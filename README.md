# Nina.fm Storage

Simple file storage, using Express.js and Multer.js

## Getting started

Create a .env at project root and put those variables inside. As you can see below, all are optionals, with default values.

```sh
# Debug to console log requests
# Default: false
DEBUG=true

# Listening port of the Express app
# Default: 3000
PORT=3003

# The public endpoint name in urls to access files
# Default: "files"
PUBLIC_ENDPOINT="public"

# The upload dir path. It can be relative to project root or absolute
# Default: "public"
UPLOAD_PATH="/var/html/www/storage"
```

Install dependencies.

```sh
npm install
```

Run the app in local or development

```sh
npm run dev
```

Run the app in production

```sh
npm run start
```

## API

The API provide two endpoints.

| URI         | Method | Body                                                          |
| ----------- | ------ | ------------------------------------------------------------- |
| /api/upload | POST   | <pre>`{ bucket?: string\|undefined; file: File }`</pre>       |
| /api/delete | POST   | <pre>`{ bucket?: string\|undefined; filename: string }`</pre> |

### Upload a file

> IMPORTANT! The FormData is required to upload a file with this API

#### HTML Submission

If you use a classical HTML form submission, you have to add the enctype attribute.

```html
<form
  action="http://localhost:3003/api/upload"
  method="POST"
  enctype="multipart/form-data"
>
  <!-- Optional bucket param -->
  <input type="hidden" name="bucket" value="avatar" />
  <!-- Requires name="file" -->
  <input type="file" name="file" />
</form>
```

#### JS/TS Submission

If you use a JS form submission with an HTTP client (fetch, axios…), you have

```ts
async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("bucket", "avatar"); // Optional but must be defined before "file"
  formData.append("file", file);

  try {
    const createdFile = await $fetch("http://localhost:3003/api/upload", {
      method: "POST",
      body: formData,
    });

    return createdFile;
  } catch (error) {
    console.error("Error uploading image file:", error);
    throw createError({
      message: "Failed to upload image file!",
      statusCode: 500,
    });
  }
}
```

#### Returned value

On file creation, the returned value is formatted as following.
Take attention to the filename, prefixed with a short uuid.

```json
{
  "bucket": "avatar",
  "filename": "1JBSTx1Qq2CB8JxcGUd12V--cover-square.jpg",
  "originalname": "cover-square.jpg",
  "publicUrl": "http://localhost:3003/public/avatar/1JBSTx1Qq2CB8JxcGUd12V--cover-square.jpg"
}
```
