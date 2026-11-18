package com.arunvineeth.portfolio.servlet;

import com.arunvineeth.portfolio.util.RabbitMQUtil;
import com.arunvineeth.portfolio.worker.ContactWorker;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * AppLifecycleListener – runs on Tomcat startup and shutdown.
 *
 *  Startup  : starts the ContactWorker daemon thread.
 *  Shutdown : stops the worker and closes the RabbitMQ connection.
 */
@WebListener
public class AppLifecycleListener implements ServletContextListener {

    private static final Logger log = LoggerFactory.getLogger(AppLifecycleListener.class);
    private ContactWorker worker;
    private Thread workerThread;

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        log.info("=== Portfolio application starting ===");
        worker = new ContactWorker();
        workerThread = new Thread(worker, "contact-worker");
        workerThread.setDaemon(true);
        workerThread.start();
        log.info("ContactWorker daemon thread started.");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        log.info("=== Portfolio application stopping ===");
        if (worker != null) {
            worker.stop();
        }
        if (workerThread != null) {
            workerThread.interrupt();
        }
        RabbitMQUtil.close();
        log.info("Application shutdown complete.");
    }
}
