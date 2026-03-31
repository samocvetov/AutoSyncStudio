//go:build windows

package studioapp

import (
	"encoding/base64"
	"errors"
	"syscall"
	"unsafe"
)

const encryptedSecretPrefix = "dpapi:"

var (
	crypt32DLL                 = syscall.NewLazyDLL("crypt32.dll")
	kernel32SecretDLL          = syscall.NewLazyDLL("kernel32.dll")
	procCryptProtectData       = crypt32DLL.NewProc("CryptProtectData")
	procCryptUnprotectData     = crypt32DLL.NewProc("CryptUnprotectData")
	procLocalFreeSecretStorage = kernel32SecretDLL.NewProc("LocalFree")
)

type dataBlob struct {
	cbData uint32
	pbData *byte
}

func encryptStoredSecret(value string) (string, error) {
	if value == "" {
		return "", nil
	}

	input := []byte(value)
	in := newDataBlob(input)
	var out dataBlob
	description, err := syscall.UTF16PtrFromString("AutoSync Studio")
	if err != nil {
		return "", err
	}

	result, _, callErr := procCryptProtectData.Call(
		uintptr(unsafe.Pointer(&in)),
		uintptr(unsafe.Pointer(description)),
		0,
		0,
		0,
		0,
		uintptr(unsafe.Pointer(&out)),
	)
	if result == 0 {
		if callErr != nil && callErr != syscall.Errno(0) {
			return "", callErr
		}
		return "", errors.New("failed to encrypt secret")
	}
	defer procLocalFreeSecretStorage.Call(uintptr(unsafe.Pointer(out.pbData)))

	return encryptedSecretPrefix + base64.StdEncoding.EncodeToString(cloneDataBlobBytes(out)), nil
}

func decryptStoredSecret(value string) (string, error) {
	if value == "" || len(value) < len(encryptedSecretPrefix) || value[:len(encryptedSecretPrefix)] != encryptedSecretPrefix {
		return value, nil
	}

	decoded, err := base64.StdEncoding.DecodeString(value[len(encryptedSecretPrefix):])
	if err != nil {
		return "", err
	}

	in := newDataBlob(decoded)
	var out dataBlob
	result, _, callErr := procCryptUnprotectData.Call(
		uintptr(unsafe.Pointer(&in)),
		0,
		0,
		0,
		0,
		0,
		uintptr(unsafe.Pointer(&out)),
	)
	if result == 0 {
		if callErr != nil && callErr != syscall.Errno(0) {
			return "", callErr
		}
		return "", errors.New("failed to decrypt secret")
	}
	defer procLocalFreeSecretStorage.Call(uintptr(unsafe.Pointer(out.pbData)))

	return string(cloneDataBlobBytes(out)), nil
}

func newDataBlob(data []byte) dataBlob {
	if len(data) == 0 {
		return dataBlob{}
	}
	return dataBlob{cbData: uint32(len(data)), pbData: &data[0]}
}

func cloneDataBlobBytes(blob dataBlob) []byte {
	if blob.cbData == 0 || blob.pbData == nil {
		return nil
	}
	src := unsafe.Slice(blob.pbData, int(blob.cbData))
	dst := make([]byte, len(src))
	copy(dst, src)
	return dst
}
