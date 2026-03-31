//go:build !windows

package studioapp

func encryptStoredSecret(value string) (string, error) { return value, nil }

func decryptStoredSecret(value string) (string, error) { return value, nil }
