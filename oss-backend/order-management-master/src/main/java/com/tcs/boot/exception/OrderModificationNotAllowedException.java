package com.tcs.boot.exception;


public class OrderModificationNotAllowedException extends RuntimeException {
    public OrderModificationNotAllowedException(String message) {
        super(message);
    }
}
