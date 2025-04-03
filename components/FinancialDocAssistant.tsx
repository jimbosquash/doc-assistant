"use client";

import { useState } from "react";
import { Button, TextField, Card, CardContent } from "@mui/material";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

export default function FinancialDocAssistant() {
  const [formData, setFormData] = useState({
    clientName: "",
    revenue: "",
    expenses: "",
    notes: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleGenerate = async () => {
    try {
      const res = await fetch("/template.docx");
      const blob = await res.blob();
      const arrayBuffer = await blob.arrayBuffer();

      const zip = new PizZip(arrayBuffer);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

      doc.setData({
        client_name: formData.clientName,
        revenue: formData.revenue,
        expenses: formData.expenses,
        notes: formData.notes,
      });

      doc.render();

      const out = doc.getZip().generate({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(out);
      link.download = `${formData.clientName}-report.docx`;
      link.click();
    } catch (error) {
      console.error("Error generating document:", error);
      alert("Failed to generate document.");
    }
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', margin: '2rem', height: 'calc(100vh - 4rem)' }}>
      {/* Left Column - Controls */}
      <div style={{
        width: '300px',
        flexShrink: 0,
        borderRight: '1px solid #e0e0e0'
      }}>
        <Card variant="outlined">
          <CardContent>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>
              Document Settings
            </h2>
            <TextField
              fullWidth
              label="Client Name"
              value={formData.clientName}
              onChange={(e) => handleChange("clientName", e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Revenue"
              type="number"
              value={formData.revenue}
              onChange={(e) => handleChange("revenue", e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Expenses"
              type="number"
              value={formData.expenses}
              onChange={(e) => handleChange("expenses", e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Notes or recommendations"
              multiline
              rows={4}
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerate}
              style={{ marginTop: "1rem" }}
            >
              Generate Document
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Preview */}
      <div style={{ flex: 1, backgroundColor: '#f5f5f5', borderRadius: '8px', padding: '2rem' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '4px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
        }}>
          <h1 style={{
            color: formData.clientName ? 'black' : 'red',
            marginBottom: '1rem'
          }}>
            {formData.clientName || 'Client Name Required'}
          </h1>

          <h3>Financial Summary</h3>
          <p style={{ color: formData.revenue ? 'black' : 'red' }}>
            Revenue: ${formData.revenue || 'Required'}
          </p>
          <p style={{ color: formData.expenses ? 'black' : 'red' }}>
            Expenses: ${formData.expenses || 'Required'}
          </p>

          <h3>Notes</h3>
          <p style={{
            color: formData.notes ? 'black' : 'red',
            fontStyle: formData.notes ? 'normal' : 'italic'
          }}>
            {formData.notes || 'Additional notes required'}
          </p>
        </div>
      </div>
    </div>
  );
}
