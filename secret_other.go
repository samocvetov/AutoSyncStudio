//go:build !windows

package main

func encryptStoredSecret(value string) (string, error) { return value, nil }

func decryptStoredSecret(value string) (string, error) { return value, nil }
