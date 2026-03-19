import { Router } from "express";
import { InvoiceController, InvoiceQueryController } from "../../controllers";
import { AuthMiddleware, CheckRolesMiddleware  } from '../../middlewares';
import { CompanyQueryDatasourceImpl, CustomerQueryDatasourceImpl, InvoiceDatasourceImpl, InvoiceQueryDatasourceImpl, ProductQueryDatasourceImpl } from '../../../infrastructure/datasources';
import { CompanyQueryRepositoryImpl, CustomerQueryRepositoryImpl, InvoiceQueryRepositoryImpl, InvoiceRepositoryImpl, ProductQueryRepositoryImpl } from '../../../infrastructure/repositories';
import { PdfService } from '../../Services/pdfmake.service';
import { GeneralInvoicetemplate } from '../../helpers';

export class InvoiceRoutes {
    public static get routes():Router{
        const router = Router();

        const pdfService = new PdfService()
        const invoiceTemplate = new GeneralInvoicetemplate();

        const companyQueryDatasource = new CompanyQueryDatasourceImpl();
        const companyQueryRepository = new CompanyQueryRepositoryImpl(companyQueryDatasource)

        const customerQueryDatasource = new CustomerQueryDatasourceImpl();
        const customerQueryRepository = new CustomerQueryRepositoryImpl(customerQueryDatasource);

        const productQueryDatasource = new ProductQueryDatasourceImpl();
        const productQueryRepository = new ProductQueryRepositoryImpl(productQueryDatasource);

        const invoiceDatasource = new InvoiceDatasourceImpl();
        const invoiceQueryDatasource = new InvoiceQueryDatasourceImpl();

        const invoiceRepository = new InvoiceRepositoryImpl(invoiceDatasource)
        const invoiceQueryRepository = new InvoiceQueryRepositoryImpl(invoiceQueryDatasource)

        const commandController = new InvoiceController(invoiceRepository, customerQueryRepository, productQueryRepository);
        const queryController = new InvoiceQueryController(companyQueryRepository, invoiceQueryRepository, customerQueryRepository, pdfService, invoiceTemplate);

        const requireWriteAccess = CheckRolesMiddleware.CheckCompanyRole("OWNER", "ADMIN");

        router.post('/create',       requireWriteAccess, commandController.createInvoice);
        router.put ('/update/:id',   requireWriteAccess, commandController.updateInvoice);
        router.delete('/delete/:id', requireWriteAccess, commandController.deleteInvoice);

        router.get ('/findAll',      queryController.findAll);
        router.get ('/find/:id',     queryController.findById);
        router.get ('/pdf/:id',      queryController.generatePdfInvoice);


        return router;
    }
}
