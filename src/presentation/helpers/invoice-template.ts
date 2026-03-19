import type { TDocumentDefinitions } from "pdfmake/interfaces";
import { InvoicePdfData, InvoicePdfOptions } from "../../domain/types";
import { Money } from "../../domain/value-objects";

interface InvoiceTemplate {
  build(
    data: InvoicePdfData,
    options: Required<InvoicePdfOptions>
  ): TDocumentDefinitions;
}

export class GeneralInvoicetemplate implements InvoiceTemplate {
  constructor() {}

  build(
    data: InvoicePdfData,
    options: Required<InvoicePdfOptions>
  ): TDocumentDefinitions {
    const {
      client,
      products,
      invoiceNumber,
      notes,
      company,
      currency,
      subtotal,
      tax,
      discount,
      total,
      amountPaid,
      paymentMethod,
      issueDate,
      dueDate,
      status,
    } = data;

    const { currencyPrefix } = options;
    const fmtCurrency = currencyPrefix || currency;

    // tax and discount are percentages — compute the actual amounts
    const taxAmount = subtotal * (tax / 100);
    const discountAmount = subtotal * (discount / 100);

    const productRows = products.map((p) => {
      const qty = p.quantity ?? 0;
      const unitPrice = p.unitPrice ?? 0;
      const lineNetTotal = p.lineTotal != null ? p.lineTotal : qty * unitPrice;

      return [
        { text: String(qty), alignment: "center", fontSize: 9 },
        { text: p.description, fontSize: 9 },
        {
          text: Money.format(unitPrice, fmtCurrency),
          alignment: "right",
          fontSize: 9,
        },
        {
          text: p.discount && p.discount > 0 ? Money.format(p.discount, fmtCurrency) : "—",
          alignment: "right",
          fontSize: 9,
        },
        {
          text: Money.format(lineNetTotal, fmtCurrency),
          alignment: "right",
          fontSize: 9,
        },
      ];
    });

    const balance = total - amountPaid;

    const docDefinition: TDocumentDefinitions = {
      pageSize: "LETTER",
      pageMargins: [40, 40, 40, 40],

      content: [
        // ====== HEADER (COMPANY + INVOICE BAND) ======
        // @ts-ignore — pdfmake typings struggle with conditional spreads
        {
          columns: [
            // Left: company block
            {
              width: "*",
              stack: [
                ...(company.logo
                  ? [
                      {
                        image: company.logo,
                        width: 80,
                        margin: [0, 0, 0, 4],
                      } as any,
                    ]
                  : []),
                {
                  text: company.name,
                  bold: true,
                  fontSize: 10,
                  margin: [0, 0, 0, 2],
                },
                { text: `${company.idType}: ${company.idValue}`, fontSize: 8 },
                { text: company.address, fontSize: 8 },
                { text: company.email, fontSize: 8 },
                { text: company.phone, fontSize: 8 },
              ],
            },

            // Right: Invoice band + dates
            {
              width: 200,
              stack: [
                {
                  table: {
                    widths: ["*"],
                    body: [
                      [
                        {
                          text: "INVOICE",
                          alignment: "right",
                          bold: true,
                          fontSize: 14,
                          margin: [4, 6, 4, 2],
                          color: "#ffffff",
                        },
                      ],
                    ],
                  },
                  fillColor: "#E54545",
                  layout: "noBorders",
                },
                {
                  table: {
                    widths: ["*"],
                    body: [
                      [
                        {
                          text: `# ${String(invoiceNumber).padStart(6, "0")}`,
                          alignment: "right",
                          fontSize: 9,
                          margin: [4, 2, 4, 0],
                          color: "#ffffff",
                        },
                      ],
                    ],
                  },
                  fillColor: "#E54545",
                  layout: "noBorders",
                  margin: [0, -2, 0, 6],
                },
                {
                  table: {
                    widths: ["auto", "*"],
                    body: [
                      [
                        { text: "Issue date:", fontSize: 8, bold: true },
                        {
                          text: issueDate.toLocaleDateString(),
                          fontSize: 8,
                          alignment: "right",
                        },
                      ],
                      ...(dueDate
                        ? [
                            [
                              { text: "Due date:", fontSize: 8, bold: true },
                              {
                                text: dueDate.toLocaleDateString(),
                                fontSize: 8,
                                alignment: "right",
                              },
                            ],
                          ]
                        : []),
                      [
                        { text: "Status:", fontSize: 8, bold: true },
                        {
                          text: status.replace("_", " "),
                          fontSize: 8,
                          alignment: "right",
                          bold: true,
                        },
                      ],
                    ],
                  },
                  layout: {
                    hLineWidth: () => 0.7,
                    vLineWidth: () => 0,
                  },
                  margin: [0, 4, 0, 0],
                },
              ],
            },
          ],
          margin: [0, 0, 0, 12],
        },

        // horizontal line under header
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 1,
            },
          ],
          margin: [0, 0, 0, 6],
        },

        // ====== CLIENT INFO ======
        {
          table: {
            widths: [60, "*", 30, "*"],
            body: [
              [
                { text: "BILL TO:", bold: true, fontSize: 8 },
                { text: client.name, fontSize: 8 },
                { text: "ID:", bold: true, fontSize: 8 },
                { text: client.identifier ?? "", fontSize: 8 },
              ],
              [
                { text: "ADDRESS:", bold: true, fontSize: 8 },
                {
                  text: client.address ?? "",
                  fontSize: 8,
                  colSpan: 3,
                },
                {},
                {},
              ],
              ...(client.email
                ? [
                    [
                      { text: "EMAIL:", bold: true, fontSize: 8 },
                      {
                        text: client.email,
                        fontSize: 8,
                        colSpan: 3,
                      },
                      {},
                      {},
                    ],
                  ]
                : []),
            ],
          },
          layout: {
            hLineWidth: () => 0.7,
            vLineWidth: () => 0,
          },
          margin: [0, 0, 0, 10],
        },

        // ====== ITEMS TABLE ======
        // @ts-ignore
        {
          table: {
            headerRows: 1,
            widths: [40, "*", 80, 70, 80],
            body: [
              // header row
              [
                {
                  text: "Qty",
                  bold: true,
                  fontSize: 9,
                  alignment: "center",
                  color: "#ffffff",
                  fillColor: "#333333",
                },
                {
                  text: "Description",
                  bold: true,
                  fontSize: 9,
                  color: "#ffffff",
                  fillColor: "#333333",
                },
                {
                  text: "Unit price",
                  bold: true,
                  fontSize: 9,
                  alignment: "right",
                  color: "#ffffff",
                  fillColor: "#333333",
                },
                {
                  text: "Discount",
                  bold: true,
                  fontSize: 9,
                  alignment: "right",
                  color: "#ffffff",
                  fillColor: "#333333",
                },
                {
                  text: "Amount",
                  bold: true,
                  fontSize: 9,
                  alignment: "right",
                  color: "#ffffff",
                  fillColor: "#333333",
                },
              ],
              // detail rows
              ...productRows,
            ],
          },
          layout: {
            hLineWidth: () => 0.7,
            vLineWidth: () => 0.7,
          },
          margin: [0, 0, 0, 10],
        },

        // ====== BOTTOM: NOTES + TOTALS ======
        // @ts-ignore — pdfmake typings struggle with conditional spreads
        {
          table: {
            widths: ["*", 200],
            body: [
              [
                // LEFT CELL: Notes + payment method
                {
                  border: [true, true, true, true],
                  margin: [4, 4, 4, 4],
                  stack: [
                    ...(notes
                      ? [
                          {
                            text: "Notes:",
                            bold: true,
                            fontSize: 8,
                            margin: [0, 0, 0, 4],
                          },
                          {
                            text: notes,
                            fontSize: 8,
                            margin: [0, 0, 0, 10],
                          },
                        ]
                      : []),
                    ...(paymentMethod
                      ? [
                          {
                            text: "Payment method:",
                            bold: true,
                            fontSize: 8,
                            margin: [0, 0, 0, 2],
                          },
                          {
                            text: paymentMethod.replace("_", " "),
                            fontSize: 8,
                          },
                        ]
                      : []),
                  ],
                },

                // RIGHT CELL: totals summary
                {
                  border: [true, true, true, true],
                  margin: [4, 4, 4, 4],
                  stack: [
                    {
                      table: {
                        widths: ["*", "auto"],
                        body: [
                          [
                            { text: "Subtotal", fontSize: 8 },
                            {
                              text: Money.format(subtotal, fmtCurrency),
                              alignment: "right",
                              fontSize: 8,
                            },
                          ],
                          ...(tax > 0
                            ? [
                                [
                                  { text: `Tax (${tax}%)`, fontSize: 8 },
                                  {
                                    text: `+ ${Money.format(taxAmount, fmtCurrency)}`,
                                    alignment: "right",
                                    fontSize: 8,
                                  },
                                ],
                              ]
                            : []),
                          ...(discount > 0
                            ? [
                                [
                                  { text: `Discount (${discount}%)`, fontSize: 8 },
                                  {
                                    text: `- ${Money.format(discountAmount, fmtCurrency)}`,
                                    alignment: "right",
                                    fontSize: 8,
                                  },
                                ],
                              ]
                            : []),
                        ],
                      },
                      layout: "noBorders",
                    },
                    {
                      canvas: [
                        {
                          type: "line",
                          x1: 0,
                          y1: 0,
                          x2: 188,
                          y2: 0,
                          lineWidth: 0.7,
                        },
                      ],
                      margin: [0, 4, 0, 2],
                    },
                    {
                      columns: [
                        {
                          text: "TOTAL",
                          bold: true,
                          fontSize: 9,
                          alignment: "left",
                        },
                        {
                          text: Money.format(total, fmtCurrency),
                          bold: true,
                          fontSize: 9,
                          alignment: "right",
                        },
                      ],
                    },
                    ...(amountPaid > 0
                      ? [
                          {
                            columns: [
                              {
                                text: "Amount paid",
                                fontSize: 8,
                                alignment: "left",
                                margin: [0, 4, 0, 0],
                              },
                              {
                                text: Money.format(amountPaid, fmtCurrency),
                                fontSize: 8,
                                alignment: "right",
                                margin: [0, 4, 0, 0],
                              },
                            ],
                          },
                          {
                            columns: [
                              {
                                text: "Balance due",
                                bold: true,
                                fontSize: 9,
                                alignment: "left",
                                margin: [0, 2, 0, 0],
                              },
                              {
                                text: Money.format(balance, fmtCurrency),
                                bold: true,
                                fontSize: 9,
                                alignment: "right",
                                margin: [0, 2, 0, 0],
                              },
                            ],
                          },
                        ]
                      : []),
                  ],
                },
              ],
            ],
          },
          layout: "noBorders",
          margin: [0, 0, 0, 8],
        },
      ],

      defaultStyle: {
        fontSize: 9,
        lineHeight: 1.1,
      },
    };

    return docDefinition;
  }
}
