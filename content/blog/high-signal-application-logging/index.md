---
title: High Signal Application Logging
date: "2020-09-24T00:00:00.000Z"
description: "Logging as a first class element"
---

Application logging is often put aside as lower priority. It is rare to see applications that treat logging as a first class element of their architecture, but logging done right can be a powerful tool on increasing the visibility of live environments. Good quality logs play a crucial role in creating alerts and visualizations. If your logs are informative and clear, it becomes easy to use them with tools for creating valuable dashboards. Tools such as *ELK*, *Splunk* or *Datadog* will easily allow you to do this,  but this is a topic I can expand on in another blog post. Likewise, high signal logs can translate into high signal alerts that inform you about abnormal application behavior.

I consider logging to be essential for my workflow, but informative logs are also a key component on attack repudiation. I learned it from the  threat modelling technique [STRIDE](https://en.wikipedia.org/wiki/STRIDE_(security)) which is a famous mnemonic that lists six categories of threats. The **R** stands for repudiation, and it means the ability to assess that something has happened and what it can be done to fix it. For instance, a user can perform some sort of malicious or fraudulent activity. If this information is not logged somewhere, the application owner won't be able to react, and might even entirely miss it.


##Formatting

Logs should always use machine readable formats. This will allow the application to use a log management tool to its full potential. 

Being able to aggregate logs, and search them by common keys will make it easier to scale application monitoring to multiple servers and services. 

My favorite format for logging is **JSON**, while it is not the best for human readability, it's supported in all log management services. 

This example show how JSON logging works on Python:

###JSON logger

```python
import json
import logging
import time


class LogEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, set):
            return tuple(obj)
        return super().default(obj)


class JsonLogger:
    def __init__(self, message, **kwargs):
        self.kwargs = kwargs
        # hard-coded fields can be configured here
        self.kwargs['message'] = message
        self.kwargs['timestamp'] = int(time.time())

    def __str__(self):
        return LogEncoder().encode(self.kwargs)


def example():
    logging.basicConfig(level=logging.INFO,
                        format='%(message)s')
    logging.info(JsonLogger(
        message='this has happened',
        user_id=12,
        order_number=400,
    ))


if __name__ == '__main__':
    example()
```

###Output
```json
{"user_id": 12, "order_number": 400, "message": "this has happened", "timestamp": 1600709474}
```

If you create logging policies where common fields are re-used accross services, you will be able to aggregate them through type and value. Based on the example above, application logs could look this:

```json
{"user_id": 12, "order_number": 400, "order_status": "unpaid", "message": "Order has been created", "timestamp": 1600709474, "path": "/create_order"}
{"user_id": 12, "order_number": 400, "order_status": "paid", "message": "Order has been succesfully paid", "timestamp": 1600709480, "path": "/complete_order"}
{"user_id": 12, "order_number": 401, "order_status": "unpaid", "message": "Order has been created", "timestamp": 1600709481, "path": "create_order"}
{"user_id": 12, "order_number": 401, "order_status": "failed", "message": "Card has been declined", "timestamp": 1600709487, "path": "complete_order"}
```

Where we can distinguish a machine readable user history: `User 12` has made two orders in a short timespan, `order 400` has been completed but `order 401` had failed because the card was declined.

On a log aggregation system, we can easily query this information. For instance, in *Datadog* the logs above could be queried such as 
`@order_status:failed AND @path:complete_order`
and that could be used to verify how often orders are having their payment declined.

The key information for the application should have its own fields, not just in the body of the message. Common fields should be agreed upon between all of the developers of the system, so they can be reused by multiple services or libraries. Documentation around these fields should be made available.

##Context

High signal logging can be obtained if you strive for low volume of highly informative log messages. 
Verbosity is not an issue. That being said, it shouldn't be through the **amount** of messages that get logged, but on **how much information** each of these messages contains. Verbosity stops being an issue if it's easy to select only the relevant information from the group of logs. Good formatting and proper use of log levelling helps on that. I will explain levelling on the next section.

Each message should include the maximum context possible, without including personal or sensitive information. Examples of relevant information can be ids of the database, status code, endpoints, HTTP methods, state, etc. Once context is added on their own fields, repeated patterns can be identified, and made into their own fields into the log format structure.

*pro-tip*: have certain internal classes and objects have their own logger encoders that expose only the relevant information. For instance:

```python
class User(something):
  def log_encode(self):
      return {
              'user_id': self.id,
              'user_status': self.status
              }
```

This shows a class where the objects can be passed to the logger, which then calls the appropriate method for that object. That would abstract away the responsibility of selecting fields to be logged to the logged objects, making it easy to make changes on their format and on keeping a common pattern accross all log data.

##Levels

Knowing when to use the correct log levels on an application can make the difference between noisy logs that often get ignored vs. informative concise logs that can easily be leveraged to increase application observability. 

####Debug
Information that is useful for developers and testers, but would be too verbose in a production scenario. This can be more verbose than the usual application logging, but production environments should be configured to supress these.

####Info
Information about succesfull operations that has happened in the system, should be very informative and full of contextual information. This should be shown in production environments, so it's important to avoid excessive `Info` level messages. As a rule of thumb, one atomic action should only result in one `Info` level log.

####Warning
Warning messages are unexpected behaviors that do not cause the application to crash or the flow of operations to be interrupted. It should be available in production environments and used with caution.

####Error
An error that caused the operation to stop, but not crash. In a web environment, an action that causes a status code 500 usually should also emit an `error` log.

####Fatal
Actions that cause the application to entirely crash. These should be used only when very relevant. In a web application, these should immediately trigger alerts.

##Dont's!

It's important to never log certain types of information. Logging of sensitive or personal identifying information (PII) can result in breaking compliance of certain regulations such as **GDRP**.
Some of the things that should never be logged are:
- Passport numbers
- Social Security Numbers
- Government issued IDs
- Passwords
- Driver Licenses
- Credit Card Numbers
- Personal addresses
- Telephone numbers
- Personal Addresses
- Public user names

Anything that can identify a user and their person or a corporation or expose their private information should not be exposed in a log.
Logs should be kept as anonymous as possible.

##Conclusion

Treating logging as a first class citizen in your application can increase your ability to know what is exactly going on your environments, and to be able to automate alerting and create visualizations based on that. 
Thinking on logging early on during development helps create best practices that can be matured with the system.

I hope this article helps on you treating logging as an essential part of your application and how to leverage that power. Thanks for reading!
