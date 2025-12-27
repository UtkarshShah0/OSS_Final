package com.tcs.boot.exception;


public class OrderCancellationNotAllowedException extends RuntimeException {
    public OrderCancellationNotAllowedException(String message) {
        super(message);
    }
}
