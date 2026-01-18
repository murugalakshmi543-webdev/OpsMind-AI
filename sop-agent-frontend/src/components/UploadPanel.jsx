import { useState } from "react";

export default function UploadPanel() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  async function upload() {
    if (!file) return;

    const formData = new FormData();
    formData.append("pdf", file);

    setStatus("Uploading...");

    try {
      const res = await fetch("http://localhost:3000/api/file", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      setStatus(`Uploaded successfully: ${data.chunks} chunks created`);
    } catch (err) {
      setStatus("Upload failed");
      console.error(err);
    }
  }

  return (
    <div className="upload-panel">
      <input type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])} />
      <button onClick={upload}>Upload SOP</button>
      <p>{status}</p>
    </div>
  );
}
